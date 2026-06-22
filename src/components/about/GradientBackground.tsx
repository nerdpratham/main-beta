import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /*glsl*/`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = /*glsl*/`
  uniform float uTime;
  uniform vec2  uResolution;
  varying vec2  vUv;

  // ── Noise helpers ─────────────────────────────────────────────────────────

  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3  i  = floor(v + dot(v, C.yyy));
    vec3  x0 = v - i + dot(i, C.xxx);
    vec3  g  = step(x0.yzx, x0.xyz);
    vec3  l  = 1.0 - g;
    vec3  i1 = min(g.xyz, l.zxy);
    vec3  i2 = max(g.xyz, l.zxy);
    vec3  x1 = x0 - i1 + C.xxx;
    vec3  x2 = x0 - i2 + C.yyy;
    vec3  x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.5 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m * m;
    return 105.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  // FBM – 4 octaves for organic complexity
  float fbm(vec3 p) {
    float val   = 0.0;
    float amp   = 0.5;
    float freq  = 1.0;
    for (int i = 0; i < 4; i++) {
      val  += amp  * snoise(p * freq);
      freq *= 2.1;
      amp  *= 0.48;
    }
    return val;
  }

  // ── Palette ────────────────────────────────────────────────────────────────
  // Sampled directly from the reference screenshot
  //   Deep coral    #E27065  →  vec3(0.886, 0.439, 0.396)
  //   Warm salmon   #F0998A  →  vec3(0.941, 0.600, 0.541)
  //   Soft peach    #F5C3B2  →  vec3(0.961, 0.765, 0.698)
  //   Cream base    #FAF2EA  →  vec3(0.980, 0.949, 0.918)

  vec3 colorDeep  = vec3(0.886, 0.439, 0.396);
  vec3 colorWarm  = vec3(0.941, 0.600, 0.541);
  vec3 colorPeach = vec3(0.961, 0.765, 0.698);
  vec3 colorCream = vec3(0.980, 0.949, 0.918);

  void main() {
    vec2 uv = vUv;

    // Slow drift in two axes
    float t = uTime * 0.08;

    // Domain-warp: warp the UV with fbm so the gradient blobs shift organically
    vec3 q = vec3(uv, 0.0);
    float warpX = fbm(q + vec3(0.0,  0.0, t));
    float warpY = fbm(q + vec3(5.2,  1.3, t));
    vec3 warped = vec3(uv + 0.30 * vec2(warpX, warpY), t * 0.5);

    // Second-pass fbm on the warped coords for richer complexity
    float n = fbm(warped + vec3(1.7, 9.2, 0.0));
    n = n * 0.5 + 0.5; // remap to [0,1]

    // Radial bias from top-left: centre of colour is upper-left
    float radial = 1.0 - smoothstep(0.0, 1.4, length(uv - vec2(-0.1, 1.1)));
    float mask   = clamp(n * 0.7 + radial * 0.55, 0.0, 1.0);

    // 4-stop mix
    vec3 col = colorCream;
    col = mix(col, colorPeach, smoothstep(0.25, 0.50, mask));
    col = mix(col, colorWarm,  smoothstep(0.50, 0.72, mask));
    col = mix(col, colorDeep,  smoothstep(0.72, 0.92, mask));

    // Subtle vignette to soften edges
    float vignette = 1.0 - smoothstep(0.5, 1.5, length(uv - vec2(0.5)));
    col = mix(colorCream, col, vignette * 1.1);

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function GradientBackground() {
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <mesh>
      {/* Full-clip-space quad — no camera needed */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime:       { value: 0 },
          uResolution: { value: new THREE.Vector2(1, 1) },
        }}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}
