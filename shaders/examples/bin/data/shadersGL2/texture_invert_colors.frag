// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

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

    vec4 color = texture2DRect(u_tex0, gl_FragCoord.xy);

    vec2 pixelCoords = st * u_tex0Resolution;

    vec3 rgb = texture2DRect(u_tex0, pixelCoords).rgb;

    rgb = 1.0 - rgb;

    gl_FragColor = vec4(rgb, 1.0);
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
