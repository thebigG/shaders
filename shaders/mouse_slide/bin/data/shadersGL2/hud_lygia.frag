// Shader from:https://www.shadertoy.com/view/4s2SRt

//Sci-fi radar based on the work of gmunk for Oblivion
//http://work.gmunk.com/OBLIVION-GFX

#include "../../../../../lygia/draw/tri.glsl"
#include "../../../../../lygia/space/ratio.glsl"
#include "../../../../../lygia/space/rotate.glsl"
#include "../../../../../lygia/math/decimate.glsl"
#include "../../../../../lygia/draw/circle.glsl"




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

#define blue1 vec3(0.74,0.95,1.00)
#define blue2 vec3(0.87,0.98,1.00)
#define blue3 vec3(0.35,0.76,0.83)
#define blue4 vec3(0.953,0.969,0.89)
#define red   vec3(1.00,0.38,0.227)

#define MOV(a,b,c,d,t) (vec2(a*cos(t)+b*cos(0.1*(t)), c*sin(t)+d*cos(0.1*(t))))

float movingLine(vec2 uv, vec2 center, float radius)
{
    //angle of the line
    float theta0 = 90.0 * u_time;
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    if(r<radius)
    {
        //compute the distance to the line theta=theta0
        vec2 p = radius*vec2(cos(theta0*M_PI/180.0),
                            -sin(theta0*M_PI/180.0));
        float l = length( d - p*clamp( dot(d,p)/dot(p,p), 0.0, 1.0) );
    	d = normalize(d);
        //compute gradient based on angle difference to theta0
   	 	float theta = mod(180.0*atan(d.y,d.x)/M_PI+theta0,360.0);
        float gradient = clamp(1.0-theta/90.0,0.0,1.0);
        return SMOOTH(l,1.0)+0.5*gradient;
    }
    else return 0.0;
}

float movingLine_lygia(vec2 uv, vec2 center, float radius)
{
    //angle of the line
    float theta0 = 90.0 * u_time;
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    if(r<radius)
    {
        //compute the distance to the line theta=theta0
        vec2 p = radius*vec2(cos(theta0*M_PI/180.0),
                            -sin(theta0*M_PI/180.0));
        float l = length( d - p*clamp( dot(d,p)/dot(p,p), 0.0, 1.0) );
    	d = normalize(d);
        //compute gradient based on angle difference to theta0
   	 	float theta = mod(180.0*atan(d.y,d.x)/M_PI+theta0,360.0);
        float gradient = clamp(1.0-theta/90.0,0.0,1.0);
        return SMOOTH(l,1.0)+0.5*gradient;
    }
    else return 0.0;
}

// float circle(vec2 uv, vec2 center, float radius, float width)
// {
//     // float r = length(uv - center);
//     // return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);

//     // vec2 st = gl_FragCoord.xy/u_resolution.xy;
//     vec2 st = gl_FragCoord.xy;
    
//     return circle(st, 0.5, 0.001);
// }
 
float circle(vec2 uv, vec2 center, float radius, float width)
{
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 _center = u_resolution.xy/2.0;
    // Circle relative to center
    vec2 new_st = smoothstep(_center-radius, _center+radius, gl_FragCoord.xy);
    
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
// Each arc has a hap in the middle.
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

// float triangles(vec2 uv, vec2 center, float radius)
// {
//     vec2 d = uv - center;
//         return RS(-8.0, 0.0, d.x-radius) * (1.0-smoothstep( 7.0+d.x-radius,9.0+d.x-radius, abs(d.y)))
//          + RS( 0.0, 8.0, d.x+radius) * (1.0-smoothstep( 7.0-d.x-radius,9.0-d.x-radius, abs(d.y)))
//          + RS(-8.0, 0.0, d.y-radius) * (1.0-smoothstep( 7.0+d.y-radius,9.0+d.y-radius, abs(d.x)))
//          + RS( 0.0, 8.0, d.y+radius) * (1.0-smoothstep( 7.0-d.y-radius,9.0-d.y-radius, abs(d.x)));
// }

float triangles(vec2 uv, vec2 center, float radius)
{
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    st.x += radius;

    st = rotate(st, M_PI/2.0);
    
    return tri(st, 0.020);
}



float triangles_lygia(vec2 uv, vec2 center, float radius)
{
    vec2 d = uv - center;
        // return RS(-8.0, 0.0, d.x-radius) * (1.0-smoothstep( 7.0+d.x-radius,9.0+d.x-radius, abs(d.y)))
        //  + RS( 0.0, 8.0, d.x+radius) * (1.0-smoothstep( 7.0-d.x-radius,9.0-d.x-radius, abs(d.y)))
        //  + RS(-8.0, 0.0, d.y-radius) * (1.0-smoothstep( 7.0+d.y-radius,9.0+d.y-radius, abs(d.x)))
        //  + RS( 0.0, 8.0, d.y+radius) * (1.0-smoothstep( 7.0-d.y-radius,9.0-d.y-radius, abs(d.x)));
    // return RS(-8.0, 0.0, d.x-radius) * (1.0-smoothstep( 7.0+d.x-radius,9.0+d.x-radius, abs(d.y)))
    //      + RS( 0.0, 8.0, d.x+radius) * (1.0-smoothstep( 7.0-d.x-radius,9.0-d.x-radius, abs(d.y)))
    //      + RS(-8.0, 0.0, d.y-radius) * (1.0-smoothstep( 7.0+d.y-radius,9.0+d.y-radius, abs(d.x)))
         return tri(uv, 0.9);
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
float bip2(vec2 uv, vec2 center)
{
    float r = length(uv - center);
    float R = 8.0+mod(87.0*u_time, 80.0);
    return (0.5-0.5*cos(30.0*u_time)) * SMOOTH(r,5.0)
        + SMOOTH(6.0,r)-SMOOTH(8.0,r)
        + smoothstep(max(8.0,R-20.0),R,r)-SMOOTH(R,r);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 finalColor;
	vec2 uv = fragCoord.xy;
    //center of the image
    vec2 c = u_resolution.xy/2.0;
    // finalColor = vec3( 0.3*_cross(uv, c, 240.0) );
    finalColor += ( circle(uv, c, 1000.0, 0.001)
                  + circle(uv, c, 1650.0, 0.001) ) * blue1;
    finalColor += (circle(uv, c, 2400.0, 0.001) );//+ dots(uv,c,240.0)) * blue4;
    // finalColor += circle3(uv, c, 313.0, 4.0) * blue1;
    finalColor += circle3_l_and_r_arcs_lygia(uv, c, 3000.0, 0.0020) * blue1; // left and right arcs
    finalColor += circle3_t_and_b_arcs_lygia(uv, c, 3000.0, 0.0020) * blue1 * 0.5; // top and bottom arcs
    // finalColor += triangles(gl_FragCoord.xy, c, 0.0 + 30.0*sin(u_time)) * blue2;
    finalColor += triangles(gl_FragCoord.xy, c, 0.0 + ((sin(u_time)) + 1.0)/4.0) * red;
    // finalColor += movingLine(uv, c, 240.0) * blue3;
    finalColor += movingLine_lygia(uv, c, 240.0) * blue3;
    finalColor += circle(uv, c, 100.0, 0.01) * blue3;
    // finalColor += 0.7 * circle2(uv, c, 262.0, 1.0, 0.5+0.2*cos(u_time)) * blue3;
    finalColor += 0.7 * circle2_lygia(uv, c, 870.000 * 3.00, 0.000725, smoothstep(-1.0,1.0,  cos(u_time)) + 0.6 ) * blue3;
    if( length(uv-c) < 240.0 )
    {
        //animate some bips with random movements
    	vec2 p = 130.0*MOV(1.3,1.0,1.0,1.4,3.0+0.1*u_time);
   		finalColor += bip1(uv, c+p) * vec3(1,1,1);
        p = 130.0*MOV(0.9,-1.1,1.7,0.8,-2.0+sin(0.1*u_time)+0.15*u_time);
        finalColor += bip1(uv, c+p) * vec3(1,1,1);
        p = 50.0*MOV(1.54,1.7,1.37,1.8,sin(0.1*u_time+7.0)+0.2*u_time);
        finalColor += bip2(uv,c+p) * red;
    }

    fragColor = vec4( finalColor, 1.0 );
}

vec2 translate(vec2 uv, vec2 offset) {
    return uv - offset;
}


#ifdef GL_ES
precision mediump float;
#endif

#include "../../../../../lygia/space/ratio.glsl"
#include "../../../../../lygia/space/rotate.glsl"
#include "../../../../../lygia/math/decimate.glsl"
#include "../../../../../lygia/draw/circle.glsl"
#include "../../../../../lygia/draw/line.glsl"

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
    // float full_line = line(new_st, _center-radius, _center+radius, width);

    float full_line = line(gl_FragCoord.xy, _center, _center+u_resolution.xy/2.0, width);

    // st = rotate(st, M_PI/2.0);
    
    return vec4(full_line);
}

vec4 simpleLine2()
{
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 _center = u_resolution.xy/2.0;
    vec2 radius = vec2(1000.0);
    float width = 0.6;
    // Circle relative to center
    vec2 new_st = smoothstep(_center-radius, _center+radius, gl_FragCoord.xy);
    
    // float full_line = line(new_st, _center-radius, _center+radius, width);

    vec2 new_point_b = _center;

    new_point_b.x =+ u_resolution.x/2.0;

    new_point_b.y =+ u_resolution.y/2.0;

    // vec2 new_point_b = _center+u_resolution.xy/2.0;

    // cart2polar();

    float full_line = line(gl_FragCoord.xy, _center, new_point_b , width);


    
    return vec4(full_line);
}



void main()
{
    vec4 outputVec = vec4(0.5);
    vec2 st = gl_FragCoord.xy/u_resolution;
    
    vec2 pos = vec2(0.5,0.5);
    float x_offset = 0.8;
    float y_offset = 0.5;
    
    float t = tri(st, 0.1);
    // mainImage(outputVec, gl_FragCoord.xy);
    // outputVec = simpleQuarterCircle();
    // outputVec = simpleHalfCircle();
    outputVec = simpleLine2();
    // outputVec += simpleLine2();

    gl_FragColor = outputVec;
}


