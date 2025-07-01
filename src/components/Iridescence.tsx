import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";

import "./Iridescence.css";

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`;

interface IridescenceProps {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
}

export default function Iridescence({
  color = [1, 1, 1],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
  ...rest
}: IridescenceProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const targetMousePos = useRef({ x: 0.5, y: 0.5 });
  const animationFrameId = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    const renderer = new Renderer({
      alpha: false,
      antialias: true,
      powerPreference: "high-performance"
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);

    let program: Program;

    function resize() {
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      const width = ctn.offsetWidth * pixelRatio;
      const height = ctn.offsetHeight * pixelRatio;
      
      renderer.setSize(width, height);
      gl.canvas.style.width = ctn.offsetWidth + 'px';
      gl.canvas.style.height = ctn.offsetHeight + 'px';
      
      if (program) {
        program.uniforms.uResolution.value = new Color(
          width,
          height,
          width / height
        );
      }
    }
    
    const resizeObserver = new ResizeObserver((entries) => {
      resize();
    });
    resizeObserver.observe(ctn);
    resize();

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(...color) },
        uResolution: {
          value: new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height
          ),
        },
        uMouse: { value: new Float32Array([mousePos.current.x, mousePos.current.y]) },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    function update(t: number) {
      // Smooth mouse interpolation for fluid movement
      const lerpFactor = 0.08;
      mousePos.current.x += (targetMousePos.current.x - mousePos.current.x) * lerpFactor;
      mousePos.current.y += (targetMousePos.current.y - mousePos.current.y) * lerpFactor;
      
      // Update uniforms
      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uMouse.value[0] = mousePos.current.x;
      program.uniforms.uMouse.value[1] = mousePos.current.y;
      
      renderer.render({ scene: mesh });
      animationFrameId.current = requestAnimationFrame(update);
    }
    
    animationFrameId.current = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    function handleMouseMove(e: MouseEvent) {
      const rect = ctn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      
      // Update target position for smooth interpolation
      targetMousePos.current = { x, y };
    }

    function handleMouseLeave() {
      // Smoothly return to center when mouse leaves
      targetMousePos.current = { x: 0.5, y: 0.5 };
    }

    if (mouseReact) {
      ctn.addEventListener("mousemove", handleMouseMove, { passive: true });
      ctn.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      resizeObserver.disconnect();
      if (mouseReact) {
        ctn.removeEventListener("mousemove", handleMouseMove);
        ctn.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (ctn.contains(gl.canvas)) {
        ctn.removeChild(gl.canvas);
      }
      // Clean up WebGL context
      const loseContext = gl.getExtension("WEBGL_lose_context");
      if (loseContext) {
        loseContext.loseContext();
      }
    };
  }, [color, speed, amplitude, mouseReact]);

  return (
    <div
      ref={ctnDom}
      className="iridescence-container"
      {...rest}
    />
  );
}
