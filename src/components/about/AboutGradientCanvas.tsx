import { Canvas } from '@react-three/fiber'
import GradientBackground from './GradientBackground'

/**
 * Full-bleed Three.js gradient canvas for the About section background.
 * Drop this as the first child of your about section with position:absolute,
 * inset-0, and pointer-events-none.
 *
 * Usage:
 *   <section className="relative min-h-screen ...">
 *     <AboutGradientCanvas />
 *     {/* your content here *\/}
 *   </section>
 */
export default function AboutGradientCanvas() {
  return (
    <Canvas
      // Orthographic – we're just drawing a full-screen quad
      orthographic
      camera={{ position: [0, 0, 1], near: 0, far: 2 }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      gl={{
        antialias: false,  // not needed for a full-screen gradient
        alpha: false,
        powerPreference: 'low-power',
      }}
      frameloop="always"
      dpr={[1, 1.5]}      // cap DPR — the shader is smooth enough
    >
      <GradientBackground />
    </Canvas>
  )
}
