#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265359

// Plot a line on Y using a value between 0.0-1.0
// float plot(vec2 st) {    
//     return smoothstep(0.00, 0.04, abs(st.x - st.y));
// }

// float plot(vec2 st) {    
//     return smoothstep(0.00, 0.001, abs(st.x - st.y));
// }

float plot(vec2 st) {    
    return smoothstep(0.500, 0.52, abs(st.y)) - smoothstep(0.510, 0.52, abs(st.y)) ;
}

float plot2(vec2 st, float point) {    
    return smoothstep(point-0.02, point, st.y) - smoothstep(point, point+0.02, st.y) ;
}




void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

    vec3 yellow, magenta, green;

    // Making Yellow
    yellow.rg = vec2(1.0);  // Assigning 1. to red and green channels
    yellow[2] = 0.0;        // Assigning 0. to blue channel

    // Making Magenta
    magenta = yellow.rbg;   // Assign the channels with green and blue swapped

    // Making Green
    green.rgb = yellow.bgb; // Assign the blue channel of Yellow (0) to red and blue channels

	gl_FragColor = vec4(yellow,1.0);
}
