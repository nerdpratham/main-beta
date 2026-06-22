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

  uniform vec3 uColorWarm;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Exponential falloff — naturally reaches zero, never fills the whole canvas
    float dist  = length(uv - vec2(0.0, 1.0));   // ← origin: top-left
    float alpha = exp(-dist * 4.0) * 0.8;         // ← 4.0 = tightness, 0.8 = max opacity

    gl_FragColor = vec4(uColorWarm, alpha);
  }
`

export default function StackFlowBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' })
    const scene = new THREE.Scene()
    const camera = new THREE.Camera()
    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uColorWarm: { value: hexToVec3(COLORS.warm) },
      },
      depthTest: false,
      depthWrite: false,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    renderer.domElement.setAttribute('aria-hidden', 'true')
    renderer.domElement.className = 'stack-flow-canvas'
    container.appendChild(renderer.domElement)

    const resize = () => {
      const width  = Math.max(container.clientWidth, 1)
      const height = Math.max(container.clientHeight, 1)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.setSize(width, height, false)
      renderer.render(scene, camera)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    return () => {
      resizeObserver.disconnect()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={containerRef} className="stack-flow-background" aria-hidden="true" />
}
