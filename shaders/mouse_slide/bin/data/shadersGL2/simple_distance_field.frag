#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
//   st.x *= u_resolution.x/u_resolution.y;

//   st.x = st.x * u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.0);
  float d = 0.0;

  // Remap the space to -1.0 to 1.0
 // 0   --> -1.0
 // 0.5 --> 0.0 
 // 1.0 --> 1.0 
 //The new origin becomes is (0.5,0.5) instead of (0,0)
  st = (st *2.0)-(1.0);

  // Make the distance field
//   d = length( abs(st)-0.3 );
//   d = length( (st)-0.3 );
  d = length( abs(st)-0.3 );
//   d = length( abs(st) );
/**
* length(abs(st)); is equivalent to 
* distance(abs(st),vec2(0.0,0.0));
*/
//   d = length(abs(st));
//   d = length((st));

//   d = length( (st) );
//   d = length( min(abs(st)-.3,0.) );
//   d = length( max(abs(st)-.3,0.) );

  // Visualize the distance field
//   gl_FragColor = vec4(vec3(fract(d*10.0)),1.0);
//   gl_FragColor = vec4(vec3(fract(d * 10.0)),1.0);
  

  gl_FragColor = vec4(vec3(fract(d*10.0)),1.0);

//   gl_FragColor = vec4(vec3(fract(d)),1.0);
//   gl_FragColor = vec4(vec3((d)),1.0);
//   gl_FragColor = vec4(vec3(fract(d)),1.0);

//   gl_FragColor = vec4(vec3(1.0 - step(1.0,d)),1.0);

//   gl_FragColor = vec4(vec3( 1.0 - d),1.0);

  // Drawing with the distance field
//   gl_FragColor = vec4(vec3( step(.3,d) ),1.0);
//   gl_FragColor = vec4(vec3( step(.3,d) * step(d,.4)),1.0);
//   gl_FragColor = vec4(vec3( smoothstep(.3,.4,d)* smoothstep(.6,.5,d)) ,1.0);
}
