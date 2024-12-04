// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Given st resolution, return a circle
// positioned at center_position with radius given.
// Returns a white circle inside of black box so it can be colored
// by the caller.
vec3 get_circle(vec2 st, in vec2 center_position, in float radius)
{
    float pct = 0.0;
    pct = distance(st,vec2(center_position));

    // Flip color from black to white. This way we can arbitrarily set color.
    vec3 color = vec3(1.0) - vec3(pct);

    // Since we flipped the relationship above (from black to white), we step on "1-radius".
    vec3 stepped_color = step((1.0-radius), color);

    return stepped_color;
}


void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;

    // gl_FragColor = vec4(get_circle(st,vec2(0.5,0.5), 0.2), 1.0);

    gl_FragColor = vec4(get_circle(st, vec2(0.5,0.5), 0.3 ) * vec3(0.0,1.0,0.0), 1.0);

    // gl_FragColor += vec4(get_circle(st,vec2(0.6,0.5), 0.2 ), 1.0);

    gl_FragColor *= vec4(get_circle(st, vec2(0.5,0.7), 0.1) * vec3(1.0,0.0,0.0), 1.0);
    
    // gl_FragColor = vec4(get_circle(st,vec2(0.0,0.0), abs(sin(u_time)  )) * vec3(1.0,0.0,0.0), 1.0);
}
