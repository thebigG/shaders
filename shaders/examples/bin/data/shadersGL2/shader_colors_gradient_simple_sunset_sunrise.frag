#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 sky_blue = vec3(0.149,0.141,0.512);
vec3 sunny_yellow = vec3(1.000,0.833,0.0);

float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) -
          smoothstep( pct, pct+0.01, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // color = vec3(0.0);

    vec3 pct = vec3(st.x);

    pct.r = smoothstep(0.0,1.0, st.x);

    pct.r = sin(u_time);

    // vec3 sunset = mix(sky_blue, sunny_yellow, pct);

    // vec3 sunrise = mix(sunny_yellow, sky_blue, pct);


    vec3 sunset = mix(sky_blue, sunny_yellow, sin(u_time));

    vec3 sunrise = mix(sunny_yellow, sky_blue, sin(u_time));

    // vec3 sunrise_to_sunset = mix(sunrise, sunset, clamp(sin(u_time), 0.8, 1.00));

    vec3 sunrise_to_sunset = mix(sunrise, sunset, sin(u_time));

    //  vec3 sunrise_to_sunset = mix(sunrise, sunset, 0.80);

    //  vec3 sunrise_to_sunset = mix(sunset, sunrise, 1.00);
    
    
    gl_FragColor = vec4(sunset,0.75);

    gl_FragColor = vec4(sunrise,0.75);
    gl_FragColor = vec4(sunrise_to_sunset,0.75);

}
