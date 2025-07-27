// Author @patriciogv - 2015

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  u_resolution;
uniform float u_time;
#include "../../../../../lygia/sdf/circleSDF.glsl"
#include "../../../../../lygia/draw/stroke.glsl"
#include "../../../../../lygia/draw/fill.glsl"

#include "../../../../../lygia/sdf/flowerSDF.glsl"
#define SKY_BLUE covertRGB(vec3(48.00, 141.00, 255))

vec3 covertRGB(in vec3 rgb) { return vec3(rgb.x / 255.00, rgb.y / 255.00, rgb.z / 255.00); }

void main()
{
    vec2 st    = gl_FragCoord.xy / u_resolution;
    vec3 color = SKY_BLUE;

    st *= 2.0; // Scale up the space by 2
    vec2 scaled_st = st;
    st             = fract(st); // Wrap around 1.0

    // Now we have 9 spaces that go from 0-1

    float circle_sdf = flowerSDF(st, 4);
    // circle_sdf = stroke(circle_sdf, 1.00, 0.1);
    if (scaled_st.x > 1.00 && scaled_st.y > 1.00)
    {
        circle_sdf = fill(circle_sdf, 0.7);
        circle_sdf = 1.00 - circle_sdf;
        if (circle_sdf < 1.0)
        {
            color = vec3(0.00, 1.00, 0.00);
        }
    }
    else
    {
        circle_sdf = stroke(circle_sdf, 0.5, 0.1);
    }
    color += vec3(circle_sdf);
    gl_FragColor = vec4(color, 1.0);
}
