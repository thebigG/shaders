// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec2 pos = vec2(0.5)-st;

    // float r = length(pos)*2.0;
    // float r = length(pos)*2.0;

    //        // Rotation by 45 degrees
    // float angle = 3.14159265 / 2.0; // 45 degrees in radians
    // float cosA = cos(angle);
    // float sinA = sin(angle);

    // Apply rotation matrix
    // vec2 rotatedPos = vec2(
    //     cosA * pos.x - sinA * pos.y,
    //     sinA * pos.x + cosA * pos.y
    // );
    float r = length(pos)*2.0;
    // float r = length(pos)*8.0;
    float a = atan(pos.y,pos.x);



    // float f = cos(a*3.);
    // float f = cos(a*3.);
    float f = cos(a*3.0);
    // f = abs(cos(a*3.));
    f = step(-0.5, f);
    f = abs(cos(a*2.5))*.5+.3;
    f = abs(cos(a*12.)*sin(a*3.))*.8+.1;
    // f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;

    // f *= sin(u_time*2.0);
    f = step(0.5, f);

    // This woud shrink it.
    f *= 0.2;

    // color = vec3( 1.-smoothstep(f,f+0.02,r) );

    // color = vec3( smoothstep(f,f+0.02,r) );

    color = vec3( 1.0 - step(f,r));

    gl_FragColor = vec4(color, 1.0);
}
