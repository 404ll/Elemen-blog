'use client';

import { useEffect, useRef } from 'react';

// Vertex shader - 用于渲染全屏四边形
const vertexShader = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_uv = (a_position + 1.0) * 0.5;
  }
`;

// Fragment shader - 你提供的着色器代码
const fragmentShader = `
  precision mediump float;
  
  #define GLSLIFY 1
  
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  varying vec2 v_uv;
  
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 2.0;
    for(int i = 0; i < 6; i++) {
      value += amplitude * noise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }
  
  float circle(vec2 uv, vec2 center, float radius, float blur) {
    float d = length(uv - center);
    return smoothstep(radius, radius - blur, d);
  }
  
  void main() {
    vec2 uv = v_uv * 2.0 - 1.0;
    uv.x *= u_resolution.x/u_resolution.y;
    
    vec2 center = vec2(0.0);
    float mouseInfluence = length(u_mouse - uv) * 0.5;
    
    float time = u_time * 0.5;
    
    // Sun core
    float sun = circle(uv, center, 0.4, 0.1);
    
    // Corona effect
    float corona = 0.0;
    for(float i = 0.0; i < 6.28; i += 0.1) {
      vec2 offset = vec2(cos(i), sin(i));
      corona += fbm(uv + offset * time) * circle(uv, center, 0.8 + sin(time + i) * 0.1, 0.5);
    }
    
    // Surface detail
    float surface = fbm(uv * 4.0 + time) * sun;
    
    // Mouse interaction
    float distortion = sin(mouseInfluence * 10.0 - time) * 0.1;
    
    vec3 color = vec3(1.0, 0.5, 0.2);
    color = mix(color, vec3(1.0, 0.8, 0.3), surface);
    color += vec3(1.0, 0.4, 0.1) * corona * 0.3;
    color *= (1.0 + distortion);
    
    // Glow
    float glow = circle(uv, center, 1.2, 1.0);
    color += vec3(1.0, 0.3, 0.1) * glow * 0.3;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function SunCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);//canvasRef是用来引用canvas元素的
  const animationFrameRef = useRef<number | undefined>(undefined); // 动画帧引用
  const mouseRef = useRef({ x: 0, y: 0 }); // 鼠标位置引用

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // 编译着色器
    function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    }

    // 创建着色器程序
    function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
      const program = gl.createProgram();
      if (!program) return null;
      
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      
      return program;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    
    if (!vs || !fs) return;

    const program = createProgram(gl, vs, fs);
    if (!program) return;

    // 设置全屏四边形
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]), gl.STATIC_DRAW);

    // 获取属性位置
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    // 调整画布大小
    function resize() {
      if (!canvas || !gl) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    resize();
    window.addEventListener('resize', resize);

    // 鼠标移动处理
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = 1 - ((e.clientY - rect.top) / rect.height) * 2;
      mouseRef.current = { x, y };
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // 动画循环
    const startTime = Date.now();
    
    function animate() {
      if (!gl || !canvas || !program) return;
      
      const currentTime = (Date.now() - startTime) / 1000;
      
      gl.useProgram(program);
      
      // 设置属性
      if (positionBuffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      }
      
      // 设置 uniform
      if (timeLocation) gl.uniform1f(timeLocation, currentTime);
      if (mouseLocation) gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);
      if (resolutionLocation) gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      
      // 绘制
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    // 清理
    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border-1 border-black bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
}

