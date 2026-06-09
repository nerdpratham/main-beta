import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

export type ShaderBgControls = {
  speed?: number
  intensity?: number
  blurMix?: number
  grainAmount?: number
  vignetteStrength?: number
  darkColor?: [number, number, number]
  lightColor?: [number, number, number]
  pointerRadius?: number
  pointerStrength?: number
  pointerFluidity?: number
  pointerDecay?: number
  flowmapSize?: number
  flowFalloff?: number
  flowAlpha?: number
  flowDissipation?: number
  opacity?: number
}

type ShaderBgProps = {
  controls?: ShaderBgControls
  className?: string
  style?: CSSProperties
  disabledMediaQuery?: string
}

const DEFAULT_CONTROLS: Required<ShaderBgControls> = {
  speed: 1,
  intensity: 1,
  blurMix: 0.4,
  grainAmount: 0.08,
  vignetteStrength: 0.3,
  darkColor: [0.08, 0.08, 0.08],
  lightColor: [0.55, 0.55, 0.55],
  pointerRadius: 0.34,
  pointerStrength: 0.18,
  pointerFluidity: 0.15,
  pointerDecay: 0.9,
  flowmapSize: 128,
  flowFalloff: 0.5,
  flowAlpha: 0.2,
  flowDissipation: 0.99,
  opacity: 1,
}

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`

const FRAGMENT_SHADER = `
  precision highp float;

  uniform float uTime;
  uniform float uSpeed;
  uniform float uIntensity;
  uniform float uBlurMix;
  uniform float uGrainAmount;
  uniform float uVignetteStrength;
  uniform float uPointerRadius;
  uniform float uPointerStrength;
  uniform float uOpacity;
  uniform vec2 uResolution;
  uniform sampler2D tFlow;
  uniform vec3 uDarkColor;
  uniform vec3 uLightColor;

  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float grain(vec2 uv, float time) {
    vec2 seed = uv * uResolution + time;
    return fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * uSpeed;

    vec4 flow = texture2D(tFlow, uv);
    vec2 flowVector = (flow.rg * 2.0 - 1.0) * uPointerStrength;
    float pointerEnergy = flow.b;

    vec2 offset = vec2(
      snoise(uv * 1.0 + t * 0.05),
      snoise(uv * 1.0 - t * 0.03 + 100.0)
    ) * 0.4;

    vec2 offset2 = vec2(
      snoise(uv * 0.6 + t * 0.08),
      snoise(uv * 0.6 - t * 0.10 + 50.0)
    ) * 0.25;

    vec2 distortedUv = uv + flowVector + offset + offset2;

    float shape1 = snoise(distortedUv * 1.2 + t * 0.12);
    float shape2 = snoise(distortedUv * 0.7 - t * 0.10 + vec2(50.0, 30.0));
    float shape3 = snoise((distortedUv + offset * 0.3) * 1.8 + t * 0.08);
    float wave = snoise(uv * 0.5 + t * 0.06) * 0.3;

    float combined = shape1 * 0.4 + shape2 * 0.35 + shape3 * 0.25;
    combined += wave;

    float depth = snoise(distortedUv * 0.4 - t * 0.05);
    combined += depth * 0.4 * uIntensity;
    combined = combined * 0.5 + 0.5;
    combined = smoothstep(0.3, 0.7, combined);

    float blur = 0.0;
    blur += snoise(distortedUv * 0.8 + t * 0.07) * 0.4;
    blur += snoise(distortedUv * 0.5 - t * 0.06) * 0.6;
    blur = blur * 0.5 + 0.5;

    float finalValue = mix(combined, blur, uBlurMix);
    finalValue = smoothstep(0.2, 0.8, finalValue);
    finalValue = pow(finalValue, 1.5);

    vec3 color = mix(uDarkColor, uLightColor, finalValue);

    float vignette = length(uv - 0.5);
    vignette = 1.0 - smoothstep(0.3, 1.1, vignette);
    color *= mix(1.0 - uVignetteStrength, 1.0, vignette);

    float grainValue = grain(uv, t * 50.0);
    color += pointerEnergy * uPointerStrength * 0.25;
    color += (grainValue - 0.5) * uGrainAmount;

    gl_FragColor = vec4(color, uOpacity);
  }
`

const FLOW_FRAGMENT_SHADER = `
  precision highp float;

  uniform sampler2D tMap;
  uniform float uFalloff;
  uniform float uAlpha;
  uniform float uDissipation;
  uniform float uAspect;
  uniform vec2 uMouse;
  uniform vec2 uVelocity;

  varying vec2 vUv;

  void main() {
    vec4 color = texture2D(tMap, vUv);
    color = mix(vec4(0.5, 0.5, 0.0, 1.0), color, uDissipation);

    vec2 cursor = vUv - uMouse;
    cursor.x *= uAspect;

    vec3 stamp = vec3(
      0.5 + uVelocity.x,
      0.5 - uVelocity.y,
      1.0 - pow(1.0 - min(1.0, length(uVelocity)), 3.0)
    );
    float falloff = smoothstep(uFalloff, 0.0, length(cursor)) * uAlpha;

    color.rgb = mix(color.rgb, stamp, vec3(falloff));
    gl_FragColor = color;
  }
`

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Unable to create shader')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(info || 'Shader compilation failed')
  }
  return shader
}

function createProgram(gl: WebGLRenderingContext) {
  const vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  const program = gl.createProgram()
  if (!program) throw new Error('Unable to create shader program')
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(info || 'Shader link failed')
  }
  return program
}

function createProgramFromSources(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
  const vertex = createShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  const program = gl.createProgram()
  if (!program) throw new Error('Unable to create shader program')
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(info || 'Shader link failed')
  }
  return program
}

function createNeutralFlowTexture(gl: WebGLRenderingContext, size: number) {
  const data = new Uint8Array(size * size * 4)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 128
    data[i + 1] = 128
    data[i + 2] = 0
    data[i + 3] = 255
  }

  const texture = gl.createTexture()
  if (!texture) throw new Error('Unable to create flow texture')
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data)
  return texture
}

function createFlowTarget(gl: WebGLRenderingContext, size: number) {
  const texture = createNeutralFlowTexture(gl, size)
  const framebuffer = gl.createFramebuffer()
  if (!framebuffer) throw new Error('Unable to create flow framebuffer')
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return { texture, framebuffer }
}

export default function ShaderBg({ controls, className, style, disabledMediaQuery }: ShaderBgProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const controlsRef = useRef({ ...DEFAULT_CONTROLS, ...controls })

  useEffect(() => {
    controlsRef.current = { ...DEFAULT_CONTROLS, ...controls }
  }, [controls])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (disabledMediaQuery && window.matchMedia(disabledMediaQuery).matches) return

    const gl = canvas.getContext('webgl', { antialias: false, alpha: true })
    if (!gl) return

    const program = createProgram(gl)
    const flowProgram = createProgramFromSources(gl, VERTEX_SHADER, FLOW_FRAGMENT_SHADER)
    const positionLocation = gl.getAttribLocation(program, 'aPosition')
    const flowPositionLocation = gl.getAttribLocation(flowProgram, 'aPosition')
    const buffer = gl.createBuffer()
    const vertices = new Float32Array([-1, -1, 3, -1, -1, 3])

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const uniforms = {
      time: gl.getUniformLocation(program, 'uTime'),
      speed: gl.getUniformLocation(program, 'uSpeed'),
      intensity: gl.getUniformLocation(program, 'uIntensity'),
      blurMix: gl.getUniformLocation(program, 'uBlurMix'),
      grainAmount: gl.getUniformLocation(program, 'uGrainAmount'),
      vignetteStrength: gl.getUniformLocation(program, 'uVignetteStrength'),
      pointerRadius: gl.getUniformLocation(program, 'uPointerRadius'),
      pointerStrength: gl.getUniformLocation(program, 'uPointerStrength'),
      opacity: gl.getUniformLocation(program, 'uOpacity'),
      resolution: gl.getUniformLocation(program, 'uResolution'),
      flow: gl.getUniformLocation(program, 'tFlow'),
      darkColor: gl.getUniformLocation(program, 'uDarkColor'),
      lightColor: gl.getUniformLocation(program, 'uLightColor'),
    }

    const flowUniforms = {
      map: gl.getUniformLocation(flowProgram, 'tMap'),
      falloff: gl.getUniformLocation(flowProgram, 'uFalloff'),
      alpha: gl.getUniformLocation(flowProgram, 'uAlpha'),
      dissipation: gl.getUniformLocation(flowProgram, 'uDissipation'),
      aspect: gl.getUniformLocation(flowProgram, 'uAspect'),
      mouse: gl.getUniformLocation(flowProgram, 'uMouse'),
      velocity: gl.getUniformLocation(flowProgram, 'uVelocity'),
    }

    let flowSize = Math.max(16, Math.round(controlsRef.current.flowmapSize))
    let flowRead = createFlowTarget(gl, flowSize)
    let flowWrite = createFlowTarget(gl, flowSize)

    let frame = 0
    let startTime = performance.now()
    let lastTime = startTime
    let targetPointer = { x: 0.5, y: 0.5 }
    let pointer = { x: 0.5, y: 0.5 }
    let targetVelocity = { x: 0, y: 0 }
    let velocity = { x: 0, y: 0 }
    let pointerInside = false

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.round(rect.width * dpr))
      const height = Math.max(1, Math.round(rect.height * dpr))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    }

    const getPointerState = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = (event.clientX - rect.left) / Math.max(rect.width, 1)
      const y = 1 - (event.clientY - rect.top) / Math.max(rect.height, 1)
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1
      return { x, y, inside }
    }

    const onPointerMove = (event: PointerEvent) => {
      const next = getPointerState(event)
      if (!next.inside) {
        pointerInside = false
        return
      }

      const now = performance.now()
      const dt = Math.max(16, now - lastTime)
      targetVelocity = {
        x: -(next.x - targetPointer.x) / dt * 16,
        y: (next.y - targetPointer.y) / dt * 16,
      }
      targetPointer = { x: next.x, y: next.y }
      lastTime = now
      pointerInside = true
    }

    const render = (now: number) => {
      resize()
      const c = controlsRef.current
      const nextFlowSize = Math.max(16, Math.round(c.flowmapSize))
      if (nextFlowSize !== flowSize) {
        gl.deleteTexture(flowRead.texture)
        gl.deleteFramebuffer(flowRead.framebuffer)
        gl.deleteTexture(flowWrite.texture)
        gl.deleteFramebuffer(flowWrite.framebuffer)
        flowSize = nextFlowSize
        flowRead = createFlowTarget(gl, flowSize)
        flowWrite = createFlowTarget(gl, flowSize)
      }

      pointer.x = targetPointer.x
      pointer.y = targetPointer.y

      const velocityFollow = Math.max(0.01, Math.min(1, Math.hypot(targetVelocity.x, targetVelocity.y) ? c.pointerFluidity : 0.1))
      velocity.x += (targetVelocity.x - velocity.x) * velocityFollow
      velocity.y += (targetVelocity.y - velocity.y) * velocityFollow

      if (!pointerInside) {
        targetVelocity.x *= c.pointerDecay
        targetVelocity.y *= c.pointerDecay
      }

      gl.useProgram(flowProgram)
      gl.bindFramebuffer(gl.FRAMEBUFFER, flowWrite.framebuffer)
      gl.viewport(0, 0, flowSize, flowSize)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.enableVertexAttribArray(flowPositionLocation)
      gl.vertexAttribPointer(flowPositionLocation, 2, gl.FLOAT, false, 0, 0)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, flowRead.texture)
      gl.uniform1i(flowUniforms.map, 0)
      gl.uniform1f(flowUniforms.falloff, c.flowFalloff * 0.5)
      gl.uniform1f(flowUniforms.alpha, c.flowAlpha)
      gl.uniform1f(flowUniforms.dissipation, c.flowDissipation)
      gl.uniform1f(flowUniforms.aspect, canvas.width / Math.max(canvas.height, 1))
      gl.uniform2f(flowUniforms.mouse, pointer.x, pointer.y)
      gl.uniform2f(flowUniforms.velocity, velocity.x, velocity.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      ;[flowRead, flowWrite] = [flowWrite, flowRead]

      gl.useProgram(program)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, flowRead.texture)
      gl.uniform1i(uniforms.flow, 0)

      gl.uniform1f(uniforms.time, (now - startTime) * 0.001)
      gl.uniform1f(uniforms.speed, c.speed)
      gl.uniform1f(uniforms.intensity, c.intensity)
      gl.uniform1f(uniforms.blurMix, c.blurMix)
      gl.uniform1f(uniforms.grainAmount, c.grainAmount)
      gl.uniform1f(uniforms.vignetteStrength, c.vignetteStrength)
      gl.uniform1f(uniforms.pointerRadius, c.pointerRadius)
      gl.uniform1f(uniforms.pointerStrength, c.pointerStrength)
      gl.uniform1f(uniforms.opacity, c.opacity)
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height)
      gl.uniform3f(uniforms.darkColor, c.darkColor[0], c.darkColor[1], c.darkColor[2])
      gl.uniform3f(uniforms.lightColor, c.lightColor[0], c.lightColor[1], c.lightColor[2])

      gl.drawArrays(gl.TRIANGLES, 0, 3)
      frame = requestAnimationFrame(render)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    frame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteProgram(flowProgram)
      gl.deleteTexture(flowRead.texture)
      gl.deleteFramebuffer(flowRead.framebuffer)
      gl.deleteTexture(flowWrite.texture)
      gl.deleteFramebuffer(flowWrite.framebuffer)
    }
  }, [disabledMediaQuery])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}
