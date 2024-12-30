#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float get_distance_field(float number_of_sides, vec2 pos, vec2 st)
{
  // TODO:Need to figure out how to use pos for distance fields...
  float d = 0.0;

  // Remap the space to -1. to 1.
  st = st *2.-1.;

  // Number of sides of your shape
  int N = 3;
  

  // Angle and radius from the current pixel
  vec2 new_st_region = smoothstep(-0.5, 0.8, st);
  // st = new_st_region;
  float a = atan(st.x,st.y)+PI;
        // a = atan(st.y,st.x)+PI;
  float r = TWO_PI/float(N);

  // Shaping function that modulate the distance
  // d = cos(floor(.5+a/r)*r-a)*length(st);
  d = cos(floor(.5+a/r)*r-a)*length(st);

  // color = vec3(1.0-smoothstep(.4,.41,d));
  // color = vec3(d);
  return d;
}

// Reference to
// http://thndl.com/square-shaped-shaders.html

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;

  st.x *= u_resolution.x/u_resolution.y;

  float d = get_distance_field(3.0, vec2(0.3), st);

  vec3 color = vec3(1.0-smoothstep(.4,.41,d));

  gl_FragColor = vec4(color,1.0);
}
