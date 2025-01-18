#ifdef GL_ES
precision mediump float;
#endif

uniform vec2        u_resolution;
// uniform vec2        u_mouse;
uniform float       u_time;

// By default all 2D shapes and space functions asume
// the center is at vec2(0.5, 0.5), this can be overloaded
// by defining CENTER_2D to be something else, like vec2(0.0)
// before the functions are include

// #define CENTER_2D vec2(0.0)

#include "../../../../../lygia/draw/fill.glsl"
#include "../../../../../lygia/space/aspect.glsl"
#include "../../../../../lygia/space/ratio.glsl"
#include "../../../../../lygia/space/center.glsl"
#include "../../../../../lygia/space/uncenter.glsl"
#include "../../../../../lygia/space/rotate.glsl"

#include "../../../../../lygia/sdf/circleSDF.glsl"
#include "../../../../../lygia/sdf/crossSDF.glsl"
#include "../../../../../lygia/sdf/flowerSDF.glsl"
#include "../../../../../lygia/sdf/gearSDF.glsl"
#include "../../../../../lygia/sdf/heartSDF.glsl"
#include "../../../../../lygia/sdf/hexSDF.glsl"
#include "../../../../../lygia/sdf/polySDF.glsl"
#include "../../../../../lygia/sdf/rectSDF.glsl"
#include "../../../../../lygia/sdf/raysSDF.glsl"
#include "../../../../../lygia/sdf/spiralSDF.glsl"
#include "../../../../../lygia/sdf/starSDF.glsl"
#include "../../../../../lygia/sdf/triSDF.glsl"
#include "../../../../../lygia/sdf/vesicaSDF.glsl"
#include "../../../../../lygia/sdf/rhombSDF.glsl"



#include "../../../../../lygia/space/ratio.glsl"
#include "../../../../../lygia/math/decimate.glsl"
#include "../../../../../lygia/draw/circle.glsl"

// void main(void) {
//     vec4 color = vec4(vec3(0.0), 1.0);
//     vec2 pixel = 1.0/u_resolution.xy;
//     vec2 st = gl_FragCoord.xy * pixel;

//     // Option 1
//     st = ratio(st, u_resolution.xy);

//     // // Option 2 
//     // st = center(st);
//     // st = aspect(st, u_resolution.xy);
//     // st = uncenter(st);

//     float cols = 4.0; 
//     st *= cols;
//     vec2 st_i = floor(st);
//     vec2 st_f = fract(st);
//     // st_f = center(st_f);

//     st_f = rotate(st_f, u_time * 0.4);

//     float sdf = 0.0;
//     float index = ( st_i.x + (cols-st_i.y - 1.0) * cols);
    
//     if (index == 0.0)
//         sdf = circleSDF( st_f );
//     else if (index == 1.0)
//         sdf = vesicaSDF( st_f, 0.25 );
//     else if (index == 2.0)
//         sdf = rhombSDF(st_f);
//     else if (index == 3.0)
//         sdf = triSDF( st_f );
//     else if (index == 4.0)
//         sdf = rectSDF( st_f, vec2(1.0) );
//     else if (index == 5.0)
//         sdf = polySDF( st_f, 5);
//     else if (index == 6.0)
//         sdf = hexSDF( st_f );
//     else if (index == 7.0)
//         sdf = starSDF(st_f, 5);
//     else if (index == 8.0)
//         sdf = flowerSDF(st_f, 5);
//     else if (index == 9.0)
//         sdf = crossSDF(st_f, 1.0);
//     else if (index == 10.0)
//         sdf = gearSDF(st_f, 10.0, 10);
//     else if (index == 11.0)
//         sdf = heartSDF(st_f);
//     else if (index == 12.0)
//         sdf = raysSDF(st_f, 14);
//     else if (index == 13.0)
//         sdf = spiralSDF(st_f, 0.1);
//     else
//              = 1.0;

//     color.rgb += fill(sdf, 0.5);
    
//     gl_FragColor = color;
// }



#include "../../../../../lygia/space/ratio.glsl"
#include "../../../../../lygia/math/decimate.glsl"
#include "../../../../../lygia/draw/circle.glsl"

void main(void) {
    vec3 color = vec3(0.0);
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    st.x += 0.5;

    color = vec3(st.x,st.y,abs(sin(u_time)));
    color = decimate(color, 20.);
    color += circle(st, 0.1, 0.01);
    
    gl_FragColor = vec4(color, 1.0);
}
