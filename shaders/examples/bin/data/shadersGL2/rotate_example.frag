// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015
//
//
#include "../../../../../lygia/space/sqTile.glsl"

#include "../../../../../lygia/space/rotate.glsl"
#include "../../../../../lygia/math/rotate2d.glsl"
#include "../../../../../lygia/sdf/lineSDF.glsl"
#include "../../../../../lygia/draw/fill.glsl"
#include "../../../../../lygia/draw/stroke.glsl"

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2  u_resolution;
uniform float u_time;

vec2 rotate2D_lygia(vec2 _st, float _angle)
{
    _st.x -= 0.2;
    _st.y -= 0.5;

    _st = rotate2d(_angle) * _st;
    _st.x += 0.2;
    _st.y += 0.5;
    return _st;
}

vec2 tile(vec2 _st, float _zoom)
{
    _st *= _zoom;
    return fract(_st);
}

vec2 rotate2D(vec2 _st, float _angle)
{
    // _st -= 0.5;
    _st.x -= 0.2;
    _st.y -= 0.5;
    // This function is not quite the same as the rotate in lygia. The sign on the sin is flipped..
    _st = mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle)) * _st;
    // _st += 0.5;
    _st.x += 0.2;
    _st.y += 0.5;

    return _st;
}

vec2 rotate2D_flipped_sin(vec2 _st, float _angle)
{
    // _st -= 0.5;
    _st.x -= 0.2;
    _st.y -= 0.5;
    // This function is not quite the same as the rotate in lygia. The sign on the sin is flipped..
    _st = mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle)) * _st;
    // _st += 0.5;
    _st.x += 0.2;
    _st.y += 0.5;

    return _st;
}

// Take a scaleed vec2 st (e.g. scaled(st, 2)) and convert to a linear index.
// Useful for selecting specific tiles
//           |
//   2   |   3
//       |
//--------------
//       |
//   0   |   1
//       |
float flatten_scaled_st(in vec2 st, in float scale_factor)
{
    float index = 0.0;
    index += step(1., mod(st.x, scale_factor));
    index += step(1., mod(st.y, scale_factor)) * scale_factor;

    return index;
}

vec2 rotateTilePattern_lygia(vec2 _st)
{
    //  Scale the coordinate system by 2x2
    _st *= 2.0;

    //  Give each cell an index number
    //  according to its position
    float index = flatten_scaled_st(_st, 2.0);

    //      |
    //  2   |   3
    //      |
    //--------------
    //      |
    //  0   |   1
    //      |

    // Make each cell between 0.0 - 1.0
    _st = fract(_st);

    // Rotate each cell according to the index
    if (index == 1.0)
    {
        //  Rotate cell 1 by 90 degrees
        // _st = rotate2D(_st, PI * 0.5);
        _st = rotate2D_lygia(_st, PI * 0.5);
    }
    else if (index == 2.0)
    {
        //  Rotate cell 2 by -90 degrees
        // _st = rotate2D(_st, PI * -0.5);
        _st = rotate2D_lygia(_st, PI * -0.5);
    }
    else if (index == 3.0)
    {
        //  Rotate cell 3 by 180 degrees
        // _st = rotate2D(_st, PI);
        _st = rotate2D_lygia(_st, PI);
    }

    return _st;
}

void main(void)
{
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    // st = tile(st,3.0);
    // st *= 3.0;
    // vec4 st4 = sqTile(st * 3.0);
    // st4 *= 2.0;
    // vec2 rotated_st = rotate(vec2(st4.x, st4.y), 0.06);

    // st = rotateTilePattern_lygia(vec2(st4.x, st.y));
    // st = rotate(st, PI/2.0, vec2(0.2,0.5));
    // st = rotate2D_flipped_sin(st, PI/8.0);
    st            = rotate2D(st, PI / 2.0);
    float sdfLine = lineSDF(st, vec2(0.2, 0.5), vec2(0.8, 0.5));
    sdfLine       = fill(sdfLine, 0.005);
    // st = rotate2D_lygia();

    // Make more interesting combinations
    // st = tile(st,2.0);
    // st = rotate2D(st,-PI*u_time*0.25);
    // st = rotateTilePattern(st*2.);
    // st = rotate2D(st,PI*u_time*0.25);

    // step(st.x,st.y) just makes a b&w triangles
    // but you can use whatever design you want.
    // gl_FragColor = vec4(vec3(step(st4.x, st4.y)), 1.0);

    gl_FragColor = vec4(vec3(sdfLine), 1.0);
}
