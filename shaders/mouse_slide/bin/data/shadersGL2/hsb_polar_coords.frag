#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

float plot2(vec2 st, float point) {    
    return smoothstep(point-0.02, point, abs(st.y)) - smoothstep(point, point+0.02, abs(st.y)) ;
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;

    float pct = plot2(st, 0.75);

    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    // color = hsb2rgb(vec3((angle/TWO_PI)+0.5,radius,1.0));

    // float new_angle = clamp(angle, PI*-1.00,PI/4.00);
    float new_angle = angle;
    // float new_angle = PI*-0.50;

    float radius_multiplier = smoothstep(-PI, PI/3.00 + 0.02, new_angle);
    // float radius_multiplier = step(PI/2.00, new_angle);
    float angle_x = (new_angle/TWO_PI);
    // float angle_x = (1.5/TWO_PI);

    color = hsb2rgb(vec3(angle_x, radius * radius_multiplier,1.0)) ;
    // color = hsb2rgb(vec3((angle/TWO_PI),radius,1.0));
    // color = hsb2rgb(vec3((angle/TWO_PI)+.25,radius,1.0));
    // color = hsb2rgb(vec3((angle/TWO_PI)+abs(sin(u_time)),radius,1.0));
    // color = hsb2rgb(vec3((angle/TWO_PI)+abs(u_time),radius,1.0));

    // color = step(vec3(0.15), color);

    gl_FragColor = vec4(color,1.0);
}
