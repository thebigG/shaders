// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 get_rect(in vec2 st, in float border, in float boundary)
{
        // bottom-left
    vec2 bl = step(vec2(border),st);
    // vec2 bl = smoothstep(vec2(0.1), vec2(0.1+0.01),st);
    float pct = bl.x * bl.y;

    // top-right
    vec2 tr = step(vec2(border),boundary-st);
    // vec2 tr = smoothstep(vec2(0.1), vec2(0.1+0.01),1.0-st);
    pct *= tr.x * tr.y;

    return vec3(pct);
}


vec3 get_rect_in_color(in vec2 st, in float border, in float boundary, vec3 color)
{
        // bottom-left
    vec2 bl = step(vec2(border),st);
    // vec2 bl = smoothstep(vec2(0.1), vec2(0.1+0.01),st);
    float pct = bl.x * bl.y;

    // top-right
    vec2 tr = step(vec2(border),boundary-st);
    // vec2 tr = smoothstep(vec2(0.1), vec2(0.1+0.01),1.0-st);
    pct *= tr.x * tr.y;

    return vec3(pct) * color;
}


void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    vec2 bl = vec2(1.0);

    if(st.x < 0.1 || st.y < 0.1)
    {
    //     bl = vec2(0.0);
          bl = floor(st);
    }

    vec2 tr = vec2(1.0);

    if(st.x > 0.9 || st.y > 0.9)
    {
        tr = floor(st);
    }

    // float floored = floor(st);

    // vec3 color = get_rect(st, 0.1, 1.0);
    // vec3 color = get_rect(st, 0.1, 0.7);
    
    // vec3 color = get_rect(st, 0.2, 0.8);

    vec3 red_rect = get_rect_in_color(st, 0.3, 0.7, vec3(1.0,0.0,0.0));

    vec3 green_rect = get_rect_in_color(st, 0.2, 0.8, vec3(0.0,1.0,0.0));

    // float pct = (bl.x * bl.y) * (tr.x * tr.y);

    // vec3 color = vec3(pct);

    // gl_FragColor = vec4(red_rect + green_rect,1.0);
    gl_FragColor = vec4(red_rect,1.0);
}