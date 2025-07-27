// Author @patriciogv - 2015

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  u_resolution;
uniform float u_time;
#include "../../../../../lygia/draw/circle.glsl"

void main()
{
    vec2 st    = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(0.0);

    st *= 3.00;     // Scale up the space by 3
    st = fract(st); // Wrap around 1.0

    // Now we have 9 spaces that go from 0-1

    // color = vec3(st,0.0);
    color = vec3(circle(st, 1.0));

    gl_FragColor = vec4(color, 1.0);
}
