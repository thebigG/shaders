	#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	gl_FragColor = vec4(st.x,st.y,0.0,1.0);
    
    if(u_mouse.x > gl_FragCoord.xy.x)
    {
       gl_FragColor = vec4(st.x,st.y,0.0,0.5); 
    }

    // gl_FragColor = vec4(st.x,st.y,0.0,0.5);

    // gl_FragColor = vec4(1.0,1,1.0,1.0);
}
