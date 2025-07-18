// Shader from:https://www.shadertoy.com/view/4s2SRt

//Sci-fi radar based on the work of gmunk for Oblivion
//http://work.gmunk.com/OBLIVION-GFX

#include "../../../../../lygia/draw/tri.glsl"
#include "../../../../../lygia/space/ratio.glsl"
#include "../../../../../lygia/space/rotate.glsl"
#include "../../../../../lygia/math/decimate.glsl"
#include "../../../../../lygia/math/radians.gsl"
#include "../../../../../lygia/draw/circle.glsl"
#include "../../../../../lygia/draw/char.glsl"
#include "../../../../../lygia/draw/fill.glsl"
#include "../../../../../lygia/draw/stroke.glsl"
#include "../../../../../lygia/sdf/circleSDF.glsl"

#ifdef GL_ES
precision mediump float;
#endif

#include "../../../../../lygia/space/ratio.glsl"
#include "../../../../../lygia/space/rotate.glsl"
#include "../../../../../lygia/space/cart2polar.glsl"
#include "../../../../../lygia/math/map.glsl"
#include "../../../../../lygia/draw/circle.glsl"
#include "../../../../../lygia/draw/line.glsl"
#include "../../../../../lygia/draw/digits.glsl"
#include "../../../../../lygia/generative/snoise.glsl"
#include "../../../../../lygia/generative/worley.glsl"





uniform vec2      u_resolution;           // viewport resolution (in pixels)
uniform float     u_time;                 // shader playback time (in seconds)
// uniform float     u_timeDelta;            // render time (in seconds)
// uniform float     iFrameRate;            // shader frame rate
// uniform int       iFrame;                // shader playback frame
// uniform float     iChannelTime[4];       // channel playback time (in seconds)
// uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
// uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
// uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
// uniform vec4      iDate;                 // (year, month, day, time in seconds)

#define SMOOTH(r,R) (1.0-smoothstep(R-1.0,R+1.0, r))
#define RANGE(a,b,x) ( step(a,x)*(1.0-step(b,x)) )
#define RS(a,b,x) ( smoothstep(a-1.0,a+1.0,x)*(1.0-smoothstep(b-1.0,b+1.0,x)) )
#define M_PI 3.1415926535897932384626433832795

#define blue1  vec3(0.74,0.95,1.00)
#define blue2  vec3(0.87,0.98,1.00)
#define blue3  vec3(0.35,0.76,0.83)
#define blue4  vec3(0.953,0.969,0.89)
#define red    vec3(1.00,0.38,0.227)
#define green1 vec3(0.74,1.00,0.20)
#define green2 vec3(0.00,1.00,0.00)

#define MOV(a,b,c,d,t) (vec2(a*cos(t)+b*cos(0.1*(t)), c*sin(t)+d*cos(0.1*(t))))

//Looks like a radar line
float movingLine_lygia(vec2 uv, vec2 center, float radius)
{
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    float width = 0.0020;
    // Circle relative to center
    float theta0 = 270.0;
    // theta0 = theta0 * u_time;
    float theta0_rads = theta0 *  (M_PI/180.0);

    vec2 d = st - center;

    st  = rotate(st, theta0_rads, center);
    float rotated_line_b = line(st, center, vec2(center.x + radius, center.y) , width);

    float angle_before_rotation = atan(d.y,d.x);
    
    float angle_before_rotation_in_degrees = (angle_before_rotation)*((180.0)/M_PI);
    // Add how many degrees we have rotated the line by  (theta0)
    float angle_after_rotation_in_degrees = angle_before_rotation_in_degrees +  theta0;
    float theta = mod(angle_after_rotation_in_degrees,360.0);
    float gradient = clamp(1.0-theta/90.0,0.0,1.0);

    float current_radius = length(d);
    if(current_radius > radius)
    {
        gradient *= 0.0;
    }
    return rotated_line_b  +( gradient ) ;
}

// Same as movingLine_lygia but it uses gl_FragCoord.xy so it is NOT relative (it is using absolute coords)
float movingLine_absolute_lygia(vec2 uv, vec2 center, float radius)
{
    vec2 st = gl_FragCoord.xy;

    float width = 0.0020;
    // Circle relative to center
    float theta0 = 90.0;
    theta0 = theta0 * u_time;
    float theta0_rads = theta0 *  (M_PI/180.0);

    vec2 d = st - center;

    st  = rotate(st, theta0_rads, center);
    float rotated_line_b = line(st, center, vec2(center.x + radius, center.y) , width);

    float angle_before_rotation = atan(d.y,d.x);
    
    float angle_before_rotation_in_degrees = (angle_before_rotation)*((180.0)/M_PI);
    // Add how many degrees we have rotated the line by  (theta0)
    float angle_after_rotation_in_degrees = angle_before_rotation_in_degrees +  theta0;
    float theta = mod(angle_after_rotation_in_degrees,360.0);
    float gradient = clamp(1.0-theta/90.0,0.0,1.0);

    float current_radius = length(d);
    if(current_radius > radius)
    {
        gradient *= 0.0;
    }
    return rotated_line_b  + (gradient) ;
}

//
float line_absolute_lygia(vec2 uv, vec2 center, float radius)
{
    float width = 0.100;
    // Circle relative to center
    float theta0 = 45.0;
    float theta0_rads = theta0 *  (M_PI/180.0);

    uv  = rotate(uv, theta0_rads, center);
    float rotated_line_right_bottom = line(uv, center, vec2(center.x + radius, center.y), width);
    float rotated_line_left_top = line(uv, center, vec2(center.x - radius, center.y), width);
    
    uv  = rotate(uv, theta0_rads*2.00, center);

    float rotated_line_left_bottom = line(uv, center, vec2(center.x + radius, center.y), width);
    float rotated_line_right_top = line(uv, center, vec2(center.x - radius, center.y), width);
    
    return rotated_line_right_bottom + rotated_line_left_top + rotated_line_left_bottom + rotated_line_right_top;
}
 
//  Adds a 0.15 scailing to the actual size of the circle.
float circle(vec2 uv, vec2 center, float radius, float width)
{
    // Circle relative to center
    vec2 new_st = smoothstep(center-radius, center+radius, gl_FragCoord.xy);
    
    // TODO:Don't love the "0.15" scaling here...
    return circle(new_st, 0.15, width);
}


float circle2(vec2 uv, vec2 center, float radius, float width, float opening)
{
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    d = normalize(d);
    if( abs(d.y) > opening )
	    return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);
    else
        return 0.0;
}



// Draws a circle with opening gap(between 0 and 1) that is applied to (0.5 * radius)
//A cos/sin wave could be used to animate the gap
//uv: current coord
//center: center of frame/rect(e.g. u_resolution.xy/2.0). The circle will be drawn relative to this center point
//radius: The radius of the circle relative to center
// stroke_width: The width of the circle stroke
// opening: A value between 0.0 and 1.0 that is applied to the gap (0.5 * radius)
float circle2_lygia(vec2 uv, vec2 center, float radius, float stroke_width, float opening)
{
    // Circle relative to center    
    vec2 new_st = smoothstep(center-radius, center+radius, uv);

    float full_circle = circle(new_st, 0.15, stroke_width);
    if ((uv.y) < (center.y + ((radius * 0.05 ) * opening) ) && ((uv.y) > (center.y - ((radius * 0.05 ) * opening) )))
    {
        full_circle = 0.0;
    }

    return full_circle;
}


float circle3(vec2 uv, vec2 center, float radius, float width)
{
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    d = normalize(d);
    float theta = 180.0*(atan(d.y,d.x)/M_PI);
    return smoothstep(2.0, 2.1, abs(mod(theta+2.0,45.0)-2.0)) *
        mix( 0.5, 1.0, step(45.0, abs(mod(theta, 180.0)-90.0)) ) *
        (SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius));
}


bool is_uv_in_gap(vec2 uv, vec2 center, float gap)
{
    bool is_in_gap = false;
    if ((uv.y) < (center.y + (gap/2.0) ) && ((uv.y) > (center.y - (gap/2.0 ) )) )
    {
        is_in_gap = true;
    }

    return is_in_gap;
}

bool is_uv_in_gap2(vec2 uv, vec2 center, float gap)
{
    bool is_in_gap = false;
    if (((uv.y) > (center.y - (gap ) ))  )
    {
        is_in_gap = true;
    }

    return is_in_gap;
}

bool is_uv_in_gap2_x(vec2 uv, vec2 center, float gap)
{
    bool is_in_gap = false;
    if (((uv.x) > (center.x - (gap ) ))  )
    {
        is_in_gap = true;
    }

    return is_in_gap;
}

bool is_uv_in_gap3(vec2 uv, vec2 center, float gap)
{
    bool is_in_gap = false;
    if ((uv.y) < (center.y + (gap) ) )
    {
        is_in_gap = true;
    }

    return is_in_gap;
}


bool is_uv_in_gap3_x(vec2 uv, vec2 center, float gap)
{
    bool is_in_gap = false;
    if ((uv.x) < (center.x + (gap) ) )
    {
        is_in_gap = true;
    }

    return is_in_gap;
}


bool is_uv_in_gap_x(vec2 uv, vec2 center, float gap)
{
    bool is_in_gap = false;
    if ((uv.x) < (center.x + (gap) ) && ((uv.x) > (center.x - (gap ) )) )
    {
        is_in_gap = true;
    }

    return is_in_gap;
}

// Draws a circle, but "carves out" the left and right side. Making arcs instead of the circle.
// Each arc has a gap in the middle.
float circle3_l_and_r_arcs_lygia(vec2 uv, vec2 center, float radius, float width)
{
    float opening  = 0.04;
    // Circle relative to center    
    
    vec2 new_st = smoothstep(center-radius, center+radius, uv);

    float full_circle = circle(new_st, 0.15, width);

    // Right and left gap, on top
    if(is_uv_in_gap(uv, center + radius * 0.07, (radius * 0.15 * opening)))
    {
        full_circle = 0.00;
    }

    // Right and left gap, on top
    if(is_uv_in_gap(uv, center - radius * 0.07, (radius * 0.15 * opening)))
    {
        full_circle = 0.00;
    }

    // top and bottom right gap, on the center
    if(is_uv_in_gap_x(uv, center, (radius * 0.15 * opening)))
    {
        full_circle = 0.00;
    }


    // middle gap in left and right sides
    if(is_uv_in_gap(uv, center, (radius * 0.15 * opening)))
    {
        full_circle = 0.00;
    }

    
    // Remove unwanted circle areas
    
    // Remove top arc
    if(is_uv_in_gap2(uv, 
                    (center + radius * 0.07 ), 
                    (radius * 0.069 * opening)))
    {
        full_circle = 0.00;
    }


    // // Remove bottom arc
    if(is_uv_in_gap3(uv, 
                    (center - radius * 0.07 ), 
                    (radius * 0.069 * opening)))
    {
        full_circle = 0.00;
    }

    return full_circle;

}



// Draws a circle, but "carves out" the top and bottom side. Making arcs instead of the circle.
// Each arc has a hap in the middle.
float circle3_t_and_b_arcs_lygia(vec2 uv, vec2 center, float radius, float width)
{
    float opening  = 0.04;

    // Circle relative to center    
    
    vec2 new_st = smoothstep(center-radius, center+radius, uv);

    float full_circle = circle(new_st, 0.15, width);

    // Right side upper corner gap
    if(is_uv_in_gap(uv, center + radius * 0.07, (radius * 0.15 * opening)))
    {
        full_circle = 0.00;
    }

    if(is_uv_in_gap(uv, center - radius * 0.07, (radius * 0.15 * opening)))
    {
        full_circle = 0.00;
    }


    if(is_uv_in_gap_x(uv, center, (radius * 0.15 * opening)))
    {
        full_circle = 0.00;
    }

    if(is_uv_in_gap(uv, center, (radius * 0.15 * opening)))
    {
        full_circle = 0.00;
    }


    
    // Remove unwanted circle areas
    // Remove right arc
    if(is_uv_in_gap2_x(uv, 
                    (center + radius * 0.14 ), 
                    (radius * 1.7 * opening)))
    {
        full_circle = 0.00;
    }

    // // Remove unwanted circle areas
    // // Remove left arc
    if(is_uv_in_gap3_x(uv, 
                    (center - radius * 0.14 ), 
                    (radius * 1.7 * opening)))
    {
        full_circle = 0.00;
    }

    return full_circle;

}

float left_triangle(vec2 xy, vec2 center)
{
    vec2 radius = vec2(10.0);
    // Move the center 300 pixels which is about where outer most arc is, relative to center.
    center.x -= 300.00;
    // Move back and forth from the new center
    xy.x += 30.0 * ((sin(u_time)));
    
    // Ensure our st is position at center, but its size is controlled by "radius"
    vec2 new_st = smoothstep(center-radius, center+radius, xy);

    new_st = rotate(new_st, M_PI/2.0);
    
    return tri(new_st, 1.00);
}

float right_triangle(vec2 xy, vec2 center)
{
    vec2 radius = vec2(10.0);
    // Move the center 300 pixels which is about where outer most arc is, relative to center.
    center.x += 300.00;
    // Move back and forth from the new center
    xy.x -= 30.0 * ((sin(u_time)));
    
    // Ensure our st is position at center, but its size is controlled by "radius"
    vec2 new_st = smoothstep(center-radius, center+radius, xy);

    new_st = rotate(new_st, -M_PI/2.0);
    
    return tri(new_st, 1.00);
}

float top_triangle(vec2 xy, vec2 center)
{
    vec2 radius = vec2(10.0);
    // Move the center 300 pixels which is about where outer most arc is, relative to center.
    center.y += 300.00;
    // Move back and forth from the new center
    xy.y -= 30.0 * ((sin(u_time)));
    
    // Ensure our st is position at center, but its size is controlled by "radius"
    vec2 new_st = smoothstep(center-radius, center+radius, xy);

    new_st = rotate(new_st, M_PI);
    
    return tri(new_st, 1.00);
}

float bottom_triangle(vec2 xy, vec2 center)
{
    vec2 radius = vec2(10.0);
    // Move the center 300 pixels which is about where outer most arc is, relative to center.
    center.y -= 300.00;
    // Move back and forth from the new center
    xy.y += 30.0 * ((sin(u_time)));
    
    // Ensure our st is position at center, but its size is controlled by "radius"
    vec2 new_st = smoothstep(center-radius, center+radius, xy);
    
    return tri(new_st, 1.00);
}

float triangles(vec2 xy, vec2 center)
{
    return  left_triangle(xy, center) 
          + right_triangle(xy, center)
          + top_triangle(xy, center) 
          + bottom_triangle(xy, center);
}

float _cross(vec2 uv, vec2 center, float radius)
{
    vec2 d = uv - center;
    int x = int(d.x);
    int y = int(d.y);
    float r = sqrt( dot( d, d ) );
    if( (r<radius) && ( (x==y) || (x==-y) ) )
        return 1.0;
    else return 0.0;
}
float dots(vec2 uv, vec2 center, float radius)
{
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    if( r <= 2.5 )
        return 1.0;
    if( ( r<= radius) && ( (abs(d.y+0.5)<=1.0) && ( mod(d.x+1.0, 50.0) < 2.0 ) ) )
        return 1.0;
    else if ( (abs(d.y+0.5)<=1.0) && ( r >= 50.0 ) && ( r < 115.0 ) )
        return 0.5;
    else
	    return 0.0;
}

float bip1(vec2 uv, vec2 center)
{
    return SMOOTH(length(uv - center),3.0);
}

vec3 ripple_circle(vec2 uv)
{
    vec2 st = uv/u_resolution.xy;
    // vec2 w = worley2(vec3(u_time * 0.1));
    vec2 _center = u_resolution.xy/2.0;
    float remappedSin =  mod(map(sin(u_time), -1.0, 1.0, 0.0, 1.0), 0.5);
    vec2 radius = vec2(200.0) * mod(u_time, 2.0);
    float width = 0.03;
    // Circle relative to center
    vec2 new_st = smoothstep(_center-radius, _center+radius, gl_FragCoord.xy);
    
    return vec3(circle(new_st, 0.15, width));
}

float bip2(vec2 uv, vec2 center)
{
    float r = length(uv - center);
    float R = 8.0+mod(87.0*u_time, 80.0);
    return (0.5-0.5*cos(30.0*u_time)) * SMOOTH(r,5.0)
        + SMOOTH(6.0,r)-SMOOTH(8.0,r)
        + smoothstep( (8.0,R-20.0),R,r)-SMOOTH(R,r);
}

//Two sdf circles. Inner circle is drawn with fill and second one is drawn with stroke.
//The inner circle "blinks" really fast at a certain rate
float bip2_lygia(vec2 uv, vec2 center)
{
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // vec2 radius = vec2(1000.0) * sin(u_time);
    vec2 radius = vec2(50.0);
    // float width = 0.15 + (mod(u_time/2.00, 0.15));
    // float width = 0.01;
    float width = 0.01;
    // float rate = sin(u_time * 16.00);
    float rate = mod(u_time, 0.2);

    gl_FragColor += digits(st, rate);
    vec2 new_st = smoothstep(center-radius, center+radius, gl_FragCoord.xy);
    float sdf = circleSDF(new_st);
    float filled = 1.00 * sdf;
    filled = stroke(sdf, 0.5, 0.1);
    // if(rate < 0.00)
    if(rate < 0.1)
    {
        width = 0.15;
        filled += fill(sdf, 0.4);
    }
    else
    {
        width = 0.01;
        filled = 1.00 * filled;
    }
    return (filled);
}

float bip1_lygia(vec2 uv, vec2 center)
{
    float radius = 100.00;
    vec2 w = worley2(vec3(u_time * 0.1));
    center += (300.00 * w);
    vec2 new_st = smoothstep(center-radius, center+radius, uv);
   
   return circle(new_st, 0.00000000000001, 0.1);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 finalColor;
	vec2 uv = fragCoord.xy;
    //center of the image
    vec2 c = u_resolution.xy/2.0;
    // finalColor = vec3( 0.3*_cross(uv, c, 240.0) );
    finalColor += ( circle(uv, c, 150.0*(20.0/3.0), 0.001)
                  + circle(uv, c, 248.0*(20.0/3.0), 0.001) ) * blue1;
    finalColor += (circle(uv, c, 360.0*(20.0/3.0), 0.001) );//+ dots(uv,c,240.0)) * blue4;
    finalColor += circle3_l_and_r_arcs_lygia(uv, c, 3000.0, 0.0020) * blue1; // left and right arcs
    finalColor += circle3_t_and_b_arcs_lygia(uv, c, 3000.0, 0.0020) * blue1 * 0.5; // top and bottom arcs
    finalColor += triangles(gl_FragCoord.xy, c);
    finalColor += movingLine_absolute_lygia(uv, c, 240.00) * blue3;
    finalColor += line_absolute_lygia(uv, c, 240.00);
    finalColor += circle(uv, c, 15.0*(20.0/3.0), 0.01) * blue3;
    
    finalColor += 0.7 * circle2_lygia(uv, c, 870.000 * 3.00, 0.000725, smoothstep(-1.0,1.0,  cos(u_time)) + 0.6 ) * blue3;
    if( length(uv-c) < 240.0 )
    {
        //animate some bips with random movements
    	vec2 p = 130.0*MOV(1.3,1.0,1.0,1.4,3.0+0.1*u_time);
   		finalColor += bip1(uv, c+p) * vec3(1,1,1);
        p = 130.0*MOV(0.9,-1.1,1.7,0.8,-2.0+sin(0.1*u_time)+0.15*u_time);
        finalColor += bip1(uv, c+p) * vec3(1,1,1);
        p = 50.0*MOV(1.54,1.7,1.37,1.8,sin(0.1*u_time+7.0)+0.2*u_time);
        finalColor += bip2_lygia(uv,c+p) * green1;
        p = 10.0*MOV(1.54,1.7,1.37,1.8,sin(0.1*u_time+7.0)+0.2*u_time);
        finalColor += bip2(uv,c+p) * red;
        finalColor += bip1_lygia(uv, c) * green1;

        finalColor += ripple_circle(uv) * green2;
    }

    fragColor = vec4(finalColor, 1.0);
}

vec2 translate(vec2 uv, vec2 offset) {
    return uv - offset;
}


vec4 simpleCircle(void) {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 _center = u_resolution.xy/2.0;
    vec2 radius = vec2(1000.0);
    float width = 0.03;
    // Circle relative to center
    vec2 new_st = smoothstep(_center-radius, _center+radius, gl_FragCoord.xy);
    
    return vec4(circle(new_st, 0.15, width));
}


vec4 simpleHalfCircle(void) {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 _center = u_resolution.xy/2.0;
    vec2 radius = vec2(2000.0)/2.0;
    float width = 0.03;
    // Circle relative to center    
    vec2 new_st = smoothstep(_center-radius, _center+radius, gl_FragCoord.xy);

    float full_circle = circle(new_st, 0.5, width);
    if (gl_FragCoord.y > _center.y)
    {
        full_circle = 0.0;
    }
    
    return vec4(full_circle);
}

vec4 simpleQuarterCircle(void) {
    vec2 _center = u_resolution.xy/2.0;
    vec2 radius = vec2(1000.0);
    float width = 0.03;
    // Circle relative to center    
    vec2 new_st = smoothstep(_center-radius, _center+radius, gl_FragCoord.xy);

    float full_circle = circle(new_st, 0.5, width);
    if (gl_FragCoord.y > _center.y*0.5)
    {
        full_circle = 0.0;
    }
    
    return vec4(full_circle);
}

//Animate the circle between _center.y*0.5 and _center.y
vec4 simpleHalfAndQuarterCircle()
{
    vec2 _center = u_resolution.xy/2.0;
    vec2 radius  = vec2(1000.0);
    float width  = 0.01;
    // Circle relative to center    
    vec2 new_st = smoothstep(_center-radius, _center+radius, gl_FragCoord.xy);
    float normalized = smoothstep(-1.0,1.0, sin(u_time * 1.0));
    float arc_gap = (_center.y * 0.5) * (normalized + 0.2);
    float full_circle = circle(new_st, 0.5, width);
    if (gl_FragCoord.y > _center.y - arc_gap)
    {
        full_circle = 0.0;
    }
    
    return vec4(full_circle);
}

vec4 simpleLine()
{
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 _center = u_resolution.xy/2.0;
    vec2 radius = vec2(1000.0);
    float width = 0.6;
    // Circle relative to center
    vec2 new_st = smoothstep(_center-radius, _center+radius, gl_FragCoord.xy);
    st = rotate(st, M_PI/2.0);
    float full_line = line(st, _center, _center+u_resolution.xy/2.0, width);

    
    return vec4(full_line);
}

// Simple rotating line. Looks like a clock hand going forward forever.
vec4 rotating_line()
{
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    float width = 0.0020;
    // Circle relative to center
    float theta0 = 90.0;
    theta0 = theta0 * u_time;
    float theta0_rads = theta0 *  (M_PI/180.0);

    float radius = 0.3;

    vec2 center  = vec2(0.5);

    vec2 d = st - center;

    vec2 old_st = st;
    st  = rotate(st, theta0_rads, center);
    vec3 rotated_line_b = (vec3(line(st, center, vec2(center.x + radius, center.y) , width)));

    float angle_before_rotation = atan(d.y,d.x);
    
    float angle_before_rotation_in_degrees = (angle_before_rotation)*((180.0)/M_PI);
    // Add how many degrees we have rotated the line by  (theta0)
    float angle_after_rotation_in_degrees = angle_before_rotation_in_degrees +  theta0;
    float theta = mod(angle_after_rotation_in_degrees,360.0);
    float gradient = clamp(1.0-theta/90.0,0.0,1.0);

    float current_radius = length(d);
    if(current_radius > radius)
    {
        gradient *= 0.0;
    }
    
    return vec4((vec3(rotated_line_b ))  +(  gradient * blue1) , 1.0);
}

float triangles_absolute()
{
    vec2 _center = u_resolution.xy/2.0;
    vec2 radius = vec2(1000.0);

    vec2 new_st = smoothstep(_center-radius, _center+radius, gl_FragCoord.xy);

    return tri(new_st, 0.020);
}

vec3 ripple_circle()
{
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 _center = u_resolution.xy/2.0;
    vec2 radius = vec2(1000.0) * sin(u_time);
    float width = 0.03;
    // Circle relative to center
    vec2 new_st = smoothstep(_center-radius, _center+radius, gl_FragCoord.xy);
    
    return vec3(circle(new_st, 0.15, width));
}

vec4 filled_circle()
{
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 _center = u_resolution.xy/2.0;
    // vec2 radius = vec2(1000.0) * sin(u_time);
    vec2 radius = vec2(1000.0);
    // float width = 0.15 + (mod(u_time/2.00, 0.15));
    // float width = 0.01;
    float width = 0.01;
    float rate = sin(u_time * 4.00);

    gl_FragColor += digits(st, rate);
    // float width = 0.30;
    // Circle relative to center
    vec2 new_st = smoothstep(_center-radius, _center+radius, gl_FragCoord.xy);

    float sdf = circle(new_st, 0.15, width);

    float filled = fill(sdf, 0.5);

    // return vec4(vec3(circle(new_st, 0.15, width)), 1.0);
    return vec4(vec3(filled), 1.0);
}

vec4 filled_circle_sdf()
{
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 _center = u_resolution.xy/2.0;
    vec2 radius = vec2(50.0);
    float width = 0.01;
    float rate = sin(u_time * 16.00);

    gl_FragColor += digits(st, rate);
    vec2 new_st = smoothstep(_center-radius, _center+radius, gl_FragCoord.xy);
    float sdf = circleSDF(new_st);
    float filled = 1.00 * sdf;
    filled = stroke(sdf, 0.5, 0.1);
    if(rate < 0.1)
    {
        width = 0.15;
        filled += fill(sdf, 0.4);
    }
    else
    {
        width = 0.01;
        filled = 1.00 * filled;
    }
    // Circle relative to center

    return vec4(vec3(filled), 1.0);
}

void main()
{
    vec4 outputVec = vec4(0.5);
    vec2 st = gl_FragCoord.xy/u_resolution;
    
    vec2 pos = vec2(0.5,0.5);
    
    float x_offset = 0.8;
    float y_offset = 0.5;
    
    vec4 t = filled_circle_sdf();
    mainImage(outputVec, gl_FragCoord.xy);

    // gl_FragColor += t;
    gl_FragColor += outputVec;
}
