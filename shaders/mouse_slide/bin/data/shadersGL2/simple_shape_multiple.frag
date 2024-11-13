// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


vec3 get_rect_smooth(in vec2 st)
{
        // bottom-left
    vec2 bl = smoothstep(vec2(0.1), vec2(0.1+0.01),st);
    float pct = bl.x * bl.y;

    // top-right
    vec2 tr = smoothstep(vec2(0.1), vec2(0.1+0.01),1.0-st);
    pct *= tr.x * tr.y;

    return vec3(pct);
}

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


vec3 get_rect_in_color(in vec2 st, in vec2 origin_coords, in float size, vec3 color)
{
    // vec2
        // bottom-left
    // vec2 bl = step(st + vec2(origin),st);

    // size += origin;
    

    float relative_size = size;
    vec2 bl = step(origin_coords+0.000001,st);
    // vec2 bl = smoothstep(vec2(0.1), vec2(0.1+0.01),st);
    float pct = bl.x * bl.y;

    // top-right
    vec2 tr = step(origin_coords+0.000001,size-st);
    // vec2 tr = step(vec2(st+origin),size-st);
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

    vec2 red_new_st = smoothstep(0.5,1.0,st);

    vec3 red_rect = get_rect_in_color(red_new_st, vec2(0.0), 0.1, vec3(1.0,0.0,0.0));

    // TODO: add function that takes rect_size and global_origin

    float rect_size =  0.2;

    vec2 blue_new_st = smoothstep(0.0,rect_size,st);

    vec2 global_origin = vec2(0.21,0.0);

    

    float blue_new_st_x = smoothstep(global_origin.x ,rect_size + global_origin.x,st.x);

    float blue_new_st_y = smoothstep(global_origin.y,rect_size + global_origin.y,st.y);


    float origin = 0.00;
    vec3 blue_rect = get_rect_in_color(vec2(blue_new_st_x, blue_new_st_y), vec2(origin), 1.0, vec3(0.0,0.0,1.0));

    vec3 blue_rect_2 = get_rect_in_color(blue_new_st, vec2(origin), 1.0, vec3(0.0,0.0,1.0));


    gl_FragColor = vec4(red_rect,1.0);

    gl_FragColor += vec4(blue_rect,1.0);

    gl_FragColor += vec4(blue_rect_2,1.0);
}
