// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform float u_time;

void main()
{
    vec2  st  = gl_FragCoord.xy / u_resolution;
    float pct = 0.0;

    // a. The DISTANCE from the pixel to the center
    pct = distance(st, vec2(0.5));

    // b. The LENGTH of the vector
    //    from the pixel to the center
    // vec2 toCenter = vec2(0.5)-st;
    // pct = length(toCenter);

    // c. The SQUARE ROOT of the vector
    //    from the pixel to the center
    // vec2 tC = vec2(0.5)-st;
    // pct = sqrt(tC.x*tC.x+tC.y*tC.y);

    // vec3 color = vec3(pct) * vec3(1.0, 0.0, 0.0);

    vec3 color = vec3(1.0) - vec3(pct);

    vec3 stepped_color = smoothstep(0.0, 0.5, color);

    // vec3 color_step = step(0.5, color);

    vec3 color_step = step(1.0, stepped_color);

    // gl_FragColor = vec4(color * vec3(1.0,  0.0, 0.0), 1.0);

    // gl_FragColor = vec4(color * color_step * vec3(1.0, 0.0, 0.0), 1.0);

    gl_FragColor = vec4(vec3(1.0, 0.0, 0.0) * color_step, 1.0);

    // gl_FragColor = vec4(color, 1.0);

    // gl_FragColor = vec4( vec3(1.0), 1.0 );
}
