import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ── Edit these two hex values to change the gradient ─────────────────────────
const COLORS = {
  light: '#FFFFFF',  // base colour (edges / right side)
  warm:  '#E0A853',  // hot colour  (blob / left side)
}
// ─────────────────────────────────────────────────────────────────────────────

function hexToVec3(hex: string): THREE.Vector3 {
  const c = hex.replace('#', '')
  return new THREE.Vector3(
    parseInt(c.slice(0, 2), 16) / 255,
    parseInt(c.slice(2, 4), 16) / 255,
    parseInt(c.slice(4, 6), 16) / 255,
  )
}

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const FRAGMENT_SHADER = `
  precision highp float;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec3  uColorLight;
  uniform vec3  uColorWarm;
  varying vec2  vUv;

  vec3 mod289v3(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289v4(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x)  { return mod289v4(((x*34.0)+10.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314*r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289v3(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0,i1.z,i2.z,1.0))
      + i.y + vec4(0.0,i1.y,i2.y,1.0))
      + i.x + vec4(0.0,i1.x,i2.x,1.0));
    float n_ = 0.142857142857;
    vec3  ns  = n_ * D.wyz - D.xzx;
    vec4 j  = p - 49.0*floor(p*ns.z*ns.z);
    vec4 x_ = floor(j*ns.z);
    vec4 y_ = floor(j - 7.0*x_);
    vec4 x  = x_*ns.x + ns.yyyy;
    vec4 y  = y_*ns.x + ns.yyyy;
    vec4 h  = 1.0 - abs(x) - abs(y);
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

  float fbm(vec3 p) {
    float v = 0.0, amp = 0.5, freq = 1.0;
    for (int i = 0; i < 4; i++) {
      v    += amp * snoise(p * freq);
      freq *= 2.1;
      amp  *= 0.48;
    }
    return v;
  }

  void main() {
    vec2  uv = vUv;
    float t  = uTime * 0.08;

    vec3  q      = vec3(uv, 0.0);
    float warpX  = fbm(q + vec3(0.00, 0.00, t));
    float warpY  = fbm(q + vec3(5.20, 1.30, t));
    vec3  warped = vec3(uv + 0.30 * vec2(warpX, warpY), t * 0.5);

    float n = fbm(warped + vec3(1.7, 9.2, 0.0));
    n = n * 0.5 + 0.5;

    float radial = 1.0 - smoothstep(0.0, 0.5, length(uv - vec2(0.0, 0.5)));
    float mask   = clamp(n * 0.6 + radial * 0.65, 0.0, 1.0);

    vec3 col = mix(uColorLight, uColorWarm, smoothstep(0.60, 1.0, mask));

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function AboutFlowBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: false, powerPreference: 'low-power' })
    const scene = new THREE.Scene()
    const camera = new THREE.Camera()
    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTime:       { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uColorLight: { value: hexToVec3(COLORS.light) },
        uColorWarm:  { value: hexToVec3(COLORS.warm)  },
      },
      depthTest: false,
      depthWrite: false,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    renderer.domElement.setAttribute('aria-hidden', 'true')
    renderer.domElement.className = 'about-flow-canvas'
    container.appendChild(renderer.domElement)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = true
    let frame = 0

    const resize = () => {
      const width = Math.max(container.clientWidth, 1)
      const height = Math.max(container.clientHeight, 1)
      const pixelRatio = Math.min(window.devicePixelRatio, Math.sqrt(2_000_000 / (width * height)), 1.5)
      renderer.setPixelRatio(Math.max(pixelRatio, 0.5))
      renderer.setSize(width, height, false)
      material.uniforms.uResolution.value.set(width, height)
    }

    const render = (time: number) => {
      material.uniforms.uTime.value = reducedMotion.matches ? 0 : time * 0.001
      renderer.render(scene, camera)
      if (visible && !reducedMotion.matches) frame = window.requestAnimationFrame(render)
    }

    const start = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(render)
    }

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else window.cancelAnimationFrame(frame)
    })
    const resizeObserver = new ResizeObserver(resize)

    resize()
    visibilityObserver.observe(container)
    resizeObserver.observe(container)
    reducedMotion.addEventListener('change', start)
    start()

    return () => {
      window.cancelAnimationFrame(frame)
      visibilityObserver.disconnect()
      resizeObserver.disconnect()
      reducedMotion.removeEventListener('change', start)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={containerRef} className="about-flow-background" aria-hidden="true" />
}
