#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

#define PI 3.14159265359

#define ONE_DEGREE 0.002777778

uniform vec2 u_resolution;
uniform float u_time;

//Very useful to "select" a specific color range from the hsb "pie"
// Select points from point to range
float select_from_range(in float point, in float range, in float input_edge)
{
    return step(point, input_edge) - step(point+range, input_edge);
}


//Very useful to "select" a specific color range from the hsb "pie"
// Select points from point to range
float select_from_range_smooth(in float point, in float range, in float input_edge)
{
    return smoothstep(point, point + 0.02, input_edge) - smoothstep((point+range), (point+range) + 0.02, input_edge);
}


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

float degrees_to_scalar(in float angle)
{
    return ONE_DEGREE * angle;
}

// https://thebookofshaders.com/05/
void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;

    
    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    // color = hsb2rgb(vec3((angle/TWO_PI)+0.5,radius,1.0));

    float new_angle = angle;
    float angle_x = (new_angle/TWO_PI)+0.5;
    // float angle_x = (new_angle/TWO_PI);

    // smoothstep(point-0.02, point, angle_x) - smoothstep(point, point+0.02, abs(st)) ;

    float radius_multiplier = 0.00;

    // Move to a function

    float selected_color = 0.35;

    float begin_point_degrees = 120.00;
    float range_degrees = 90.00;

    radius_multiplier = select_from_range_smooth(degrees_to_scalar(begin_point_degrees), degrees_to_scalar(range_degrees), angle_x);
    //  radius_multiplier = select_from_range(selected_color,selected_color  + degrees_to_scalar(15.00), angle_x);
    //  radius_multiplier = select_from_range(selected_color,degrees_to_scalar(range_degrees) , angle_x);
    // radius_multiplier = 1.00;

    // color = hsb2rgb(vec3(angle_x, radius * radius_multiplier,1.0)) ;

    if(radius_multiplier == 1.00)
    {
        color = hsb2rgb(vec3(selected_color, radius ,1.0));
    }

    else
    {
        color = hsb2rgb(vec3(angle_x, radius ,1.0));
    }
    

    // color = hsb2rgb(vec3(0.00, radius,1.0)) ;
    // color = hsb2rgb(vec3((angle/TWO_PI),radius,1.0));
    // color = hsb2rgb(vec3((angle/TWO_PI)+.25,radius,1.0));
    // color = hsb2rgb(vec3((angle/TWO_PI)+abs(sin(u_time)),radius,1.0));
    // color = hsb2rgb(vec3((PI/TWO_PI)+abs(u_time),radius,1.0));

    // color = hsb2rgb(vec3((PI* 1.50/TWO_PI) + 0.5,radius,1.0));

    // color = step(vec3(0.15), color);

    gl_FragColor = vec4(color,1.0);
}
