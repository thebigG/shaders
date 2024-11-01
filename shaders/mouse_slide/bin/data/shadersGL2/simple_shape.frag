// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 get_rect(in vec2 st, in float border)
{
        // bottom-left
    vec2 bl = step(vec2(border),st);
    // vec2 bl = smoothstep(vec2(0.1), vec2(0.1+0.01),st);
    float pct = bl.x * bl.y;

    // top-right
    vec2 tr = step(vec2(border),1.0-st);
    // vec2 tr = smoothstep(vec2(0.1), vec2(0.1+0.01),1.0-st);
    pct *= tr.x * tr.y;

    return vec3(pct);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    // vec2 bl = vec2(1.0);

    // if(st.x < 0.3 && st.y < 0.3)
    // {
    //     bl = vec2(0.0);
    //     // bl = floor(st);
    // }

    // float floored = floor(st);

    vec3 color = get_rect(st, 0.1);

    float pct = bl.x * bl.y;

    // vec3 color = vec3(pct);

    gl_FragColor = vec4(color,1.0);
}
