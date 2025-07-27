#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform float u_time;

#define PI 3.14159265359

// Plot a line on Y using a value between 0.0-1.0
// float plot(vec2 st) {
//     return smoothstep(0.00, 0.04, abs(st.x - st.y));
// }

// float plot(vec2 st) {
//     return smoothstep(0.00, 0.001, abs(st.x - st.y));
// }

float plot(vec2 st)
{
    return smoothstep(0.500, 0.52, abs(st.y)) - smoothstep(0.510, 0.52, abs(st.y));
}

float plot2(vec2 st, float point)
{
    return smoothstep(point - 0.02, point, abs(st.y)) - smoothstep(point, point + 0.02, abs(st.y));
}

void main()
{
    vec2 st = gl_FragCoord.xy / u_resolution;

    float y = st.x;

    vec3 color = vec3(y);

    float new_x = smoothstep(0.5, 1.0, st.x);
    // Plot a line
    float pct = plot2(st, 0.52);

    y = pow(st.x, 0.50);
    // y = log(st.x);
    // y = sqrt(PI);

    pct = plot2(st, y);

    // Turn on only the x points we want...
    // pct = pct * (smoothstep(0.5,0.8, st.x) - smoothstep(0.8,0.802, st.x) );

    // float pct = plot2(st, new_x);
    // color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);

    color = pct * vec3(0.0, 1.0, 0.0);

    gl_FragColor = vec4(color, 1.0);
}
