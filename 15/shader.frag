precision highp float;

uniform vec3 uColor;
varying vec2 vUv;

#define TWO_PI 6.28318

// Ridged multifractal
// See "Texturing & Modeling, A Procedural Approach", Chapter 12
float ridge(float h, float offset) {
    h = abs(h);     // create creases
    h = offset - h; // invert so creases are at top
    h = h * h;      // sharpen creases
    return h;
}

// Source: https://www.shadertoy.com/view/3lf3z2
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
float noise(vec2 x) {
	vec2 i = floor(x);
	vec2 f = fract(x);
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

#define octaves 8
float fbm (in vec2 p) {

    float value = 0.0;
    float freq = 1.0;
    float amp = 0.5;    

    for (int i = 0; i < octaves; i++) {
        value += amp * (noise((p - vec2(1.0)) * freq));
        freq *= 5.0;
        amp *= 0.6;
    }
    return value;
}


float convolution(vec2 p)
{
    vec2 offset = vec2(-0.5);

    vec2 aPos = vec2(sin(1.0 * 0.005), sin(1.0 * 0.01)) * 6.;
    vec2 aScale = vec2(3.0);
    float a = fbm(p * aScale + aPos);

    vec2 bPos = vec2(sin(1.0 * 0.01), sin(1.0 * 0.01)) * 1.;
    vec2 bScale = vec2(0.6);
    float b = fbm((p + a) * bScale + bPos);  

    vec2 cPos = vec2(-0.6, -0.5) + vec2(sin(-1.0 * 0.001), sin(1.0 * 0.01)) * 2.;
    vec2 cScale = vec2(2.6);
    float c = fbm((p + b) * cScale + cPos);
    return c;
}

// Source: https://palmdrop.github.io/post/domain-warping/
vec2 warp(vec2 p, float maxDist) {
    float angle = noise(p * 0.9) * TWO_PI;
    float dist = ridge(noise(p), 1.0) * 0.3;

    vec2 offset = vec2(cos(angle), sin(angle)) * dist;

    return p + offset;
}

void main() {
  vec2 uv = vUv;

  vec2 warped = warp(uv * 10.0, 1.0);
  float value = convolution(warped * 0.4);
  // value = pow(value, 1.5);

  vec3 color = mix(vec3(value), uColor, 0.5);
  // color = pow(color, vec3(0.5));
  // color = pow(color, vec3(2.0));

  gl_FragColor = vec4(color, 1.0);
}