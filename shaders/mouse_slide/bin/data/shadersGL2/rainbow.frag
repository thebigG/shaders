#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
vec3 red = vec3(1.00, 0, 0);
vec3 orange = vec3(0.98, 0.53, 0.003);
vec3 yellow = vec3(0.98, 0.84, 0.090196078);
vec3 green = vec3(0.00, 0.73, 0.184);
vec3 blue = vec3(0.00, 0.76, 0.82);
vec3 indigo = vec3(0.00, 0.25, 0.55);
vec3 violet = vec3(0.37, 0.16, 0.47);


void main()
{
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    vec3 rainbow =  mix(red, orange, step(0.16, st.x));

    rainbow =  mix(rainbow, yellow, step(0.32, st.x));
    rainbow =  mix(rainbow, green, step(0.48, st.x));
    rainbow =  mix(rainbow, blue, step(0.64, st.x));
    rainbow =  mix(rainbow, indigo, step(0.80, st.x));
    rainbow =  mix(rainbow, violet, step(0.96, st.x));

    gl_FragColor = vec4(rainbow,1.00);
}