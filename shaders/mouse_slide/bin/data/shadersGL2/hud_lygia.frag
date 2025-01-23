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
    // These magical values should be passed to the function
    vec2 new_st = smoothstep(_center-500.0, _center+500.0, gl_FragCoord.xy);
    
    return circle(new_st, 0.5, 0.01);
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
    finalColor += ( circle(uv, c, 100.0, 1.0)
                  + circle(uv, c, 165.0, 1.0) ) * blue1;
    finalColor += (circle(uv, c, 240.0, 2.0) );//+ dots(uv,c,240.0)) * blue4;
    finalColor += circle3(uv, c, 313.0, 4.0) * blue1;
    // finalColor += triangles(gl_FragCoord.xy, c, 0.0 + 30.0*sin(u_time)) * blue2;
    finalColor += triangles(gl_FragCoord.xy, c, 0.0 + ((sin(u_time)) + 1.0)/4.0) * blue2;
    finalColor += movingLine(uv, c, 240.0) * blue3;
    finalColor += circle(uv, c, 10.0, 1.0) * blue3;
    finalColor += 0.7 * circle2(uv, c, 262.0, 1.0, 0.5+0.2*cos(u_time)) * blue3;
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

vec4 simpleCircle(void) {
    vec3 color = vec3(0.0);
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    // st = gl_FragCoord.xy/vec2(100,100);


    st = gl_FragCoord.xy/vec2(300,300);

    st -= 1.0;

    // st = gl_FragCoord.xy/vec2(100,100);

    // st -= 1.0;

    // st = rotate(st, M_PI/2.0);

    // st.x = smoothstep(0.5,0.65, st.x);
    // st.y = smoothstep(0.5,0.65, st.y);
    
    // st = ratio(st, vec2(100,100));
    // st.x -= 0.5;
    color += circle(st, 1.0);
    
    return vec4(color, 1.0);
}


void main()
{
    vec4 outputVec = vec4(0.5);
    vec2 st = gl_FragCoord.xy/u_resolution;
    
    vec2 pos = vec2(0.5,0.5);
    float x_offset = 0.8;
    float y_offset = 0.5;
    // st.x = smoothstep(pos.x ,pos.x + x_offset, st.x);
    // st.y = smoothstep(pos.y,pos.y + y_offset, st.y);

    // st.x = smoothstep(pos.x ,pos.x, st.x);
    // st.y = smoothstep(pos.y,pos.y, st.y);
    
    float t = tri(st, 0.1);
    // st += vec2(0.5);
    mainImage(outputVec, gl_FragCoord.xy);
    // st -= vec2(0.5);
    // outputVec = simpleCircle();






    gl_FragColor = outputVec;
}


