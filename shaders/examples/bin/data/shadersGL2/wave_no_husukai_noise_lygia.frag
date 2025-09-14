// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#include "../../../../../lygia/space/sqTile.glsl"
#include "../../../../../lygia/generative/gnoise.glsl"

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

// uniform sampler2D     u_tex0;// Use this when using ofDisableArbTex()
// Use sampler2DRect when we want normalized (0.0-1.0) coords.
uniform sampler2DRect u_tex0;
uniform vec2          u_tex0Resolution;

uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform float u_time;

void main()
{
    // normalize 0–1
    vec2 st = gl_TexCoord[0].st / u_tex0Resolution;

    // do stuff in 0–1 space (e.g., flip y, wrap, etc.)
    // ...

    // convert back to pixel coords for sampler2DRect
    // vec2 pixelCoords = st * u_tex0Resolution;
    // vec2 st = gl_FragCoord.xy/u_resolution.xy;

    float scale  = 1.0;
    float offset = 0.5;

    float angle   = gnoise(st.x + u_time * 0.1) * PI;
    float angle_x = st.x + u_time * 0.1 * PI;
    float angle_y = st.y + u_time * 0.1 * PI;
    float radius  = offset;

    st *= scale;
    // vec4 tiles  = sqTile(st, scale);
    // st = tiles.xy;
    st += radius * vec2(cos(angle), sin(angle));

    vec2 pixelCoords = st * u_tex0Resolution;

    vec4 color = texture2DRect(u_tex0, pixelCoords);

    gl_FragColor = color;
}