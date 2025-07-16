// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.14159265359

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float cross(in vec2 _st, float _size){
    return  box(_st, vec2(_size,_size/4.)) +
            box(_st, vec2(_size/4.,_size));
}

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}


float parabola( float x, float k ){
    return pow( 4.0*x*(1.0-x), k );
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    // To move the cross we move the space

    float y = pow(u_time,0.4);
    // y = fract(u_time);

    y = parabola(u_time, 1.0);

    y = mod( u_time,1.0);


    vec2 translate = vec2(cos( mod( u_time,1.0)),sin(mod( u_time,1.0)));
    // The abs function transformation makes it look almost like a pendulum
    translate = vec2((cos(u_time)),(sin( u_time )) );
    // translate = vec2(cos(u_time + PI/2.0),cos(u_time + PI/4.0));
    // translate = vec2(y);

    // translate = vec2(cos(y),sin(y));
    st += translate*0.3;

    st -= vec2(0.5);

    // st = rotate2d((sin(u_time)) * PI) * st; // Alternating rotation right-to-left and left-to-right
    st = rotate2d(((u_time)) * PI) * st; //Keeps rotating without stopping

    st += vec2(0.5) ;

    // st += translate;

    // Show the coordinates of the space on the background
     color = vec3(st.x,st.y,0.0);

    // Add the shape on the foreground
    color += vec3(cross(st,0.25));
    // color += vec3(box(st,vec2(0.25)));

    gl_FragColor = vec4(color,1.0);
}
