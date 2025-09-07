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
    vec2 st    = gl_FragCoord.xy / u_resolution.xy;
    vec4 color = vec4(st.x, st.y, 0.0, 1.0);

    color = texture2D(u_tex0, st);

    gl_FragColor = color;
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
