/**
 * Hero atmosphere shaders. Domain-warped simplex fbm over the machine-enamel
 * palette — the WebGL sibling of HeroFallback.jsx's feTurbulence warp. Very
 * low contrast by construction: the whole tonal range spans four near-identical
 * greens. The gentle radial darkening at the edges is the one sanctioned hero
 * vignette. PRD §5.12 · §3.3
 */

export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uMouse;   // -0.5..0.5, lerped in JS
  uniform vec2 uRes;
  varying vec2 vUv;

  // Ashima 2D simplex noise (public domain)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 10.0) * x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
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

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * snoise(p);
      p = p * 2.03 + 17.7;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * vec2(uRes.x / uRes.y, 1.0) * 1.35;
    p += uMouse * 0.12;

    float t = uTime * 0.018;
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(3.7, 1.2) - t * 0.8));
    float n = fbm(p + 1.5 * q + t * 0.5);
    n = 0.5 + 0.5 * n;

    // four near-identical machine greens — atmosphere, not a graphic
    vec3 deep = vec3(0.086, 0.106, 0.094);   // #161b18
    vec3 base = vec3(0.110, 0.133, 0.118);   // #1c221e
    vec3 lift = vec3(0.149, 0.180, 0.161);   // #262e29
    vec3 high = vec3(0.169, 0.204, 0.184);   // #2b342f

    vec3 col = mix(base, lift, smoothstep(0.35, 0.75, n));
    col = mix(col, high, smoothstep(0.78, 0.97, n) * 0.5);
    col = mix(deep, col, smoothstep(0.02, 0.35, n) * 0.85 + 0.15);

    // the one sanctioned radial vignette, barely there
    float d = distance(uv, vec2(0.5, 0.42));
    col *= 1.0 - 0.22 * smoothstep(0.45, 0.95, d);

    gl_FragColor = vec4(col, 1.0);
  }
`;
