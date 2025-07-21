// Author @patriciogv - 2015

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
#include "../../../../../lygia/sdf/circleSDF.glsl"
#include "../../../../../lygia/draw/stroke.glsl"

#define SKY_BLUE vec3(0.0,0.0,1.0)

void main() {
	 vec2 st = gl_FragCoord.xy/u_resolution;
   vec3 color = SKY_BLUE;

   st *= 1.0;      // Scale up the space by 3
   st = fract(st); // Wrap around 1.0

    // Now we have 9 spaces that go from 0-1
    float circle_sdf = circleSDF(st);
    
    circle_sdf = stroke(circle_sdf, 0.5, 0.1);

    // circle_sdf = 1.00 - circle_sdf;

    // color = vec3(st,0.0);
    // color = vec3(circle(circle_sdf,1.0));
    color += vec3(circle_sdf);
	  
    gl_FragColor = vec4(color,1.0);
}
