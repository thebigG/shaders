// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


float plot(vec2 st, float point) {    
    return smoothstep(point-0.02, point, (st.x)) - smoothstep(point, point+0.02, (st.x)) ;
}

//Literally the same function as above, but
// it makes it a little bit more obvious that this plotting can be used for polar shape functions
// too.
//Extremely useful for drawing contours of shapes. 
// https://thebookofshaders.com/07/
float plot_polar(float r, float point) {    
    return smoothstep(point-0.02, point, (r)) - smoothstep(point, point+0.02, (r)) ;
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
    vec2 pos = vec2(0.5)-st;
    float r = length(pos)*3.0;
    float a = atan(pos.y,pos.x);

    float f = cos(a*5.0);
    // f *= abs(cos(a*3.));
    // f *= abs(cos(a*2.5))*.5+.3;
    // f *= abs(cos(a*12.)*sin(a*3.))*.8+.1;
    f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;

    float shape = smoothstep(f,f+0.02,r);

    color = vec3(smoothstep(f-0.2,f, r)) - vec3(smoothstep(f,f+0.2, r));

    color = (vec3(smoothstep(f-0.02,f, r)) - vec3(smoothstep(f,f+0.02, r)));

    color = vec3(plot_polar(r, f));

    gl_FragColor = vec4(color, 1.0);
}
