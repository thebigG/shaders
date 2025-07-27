
#include "../../../../../lygia/space/ratio.glsl"
#include "../../../../../lygia/space/rotate.glsl"
#include "../../../../../lygia/space/cart2polar.glsl"
#include "../../../../../lygia/math/map.glsl"
#include "../../../../../lygia/draw/circle.glsl"
#include "../../../../../lygia/draw/line.glsl"

// Simple rotating line. Looks like a clock hand going forward forever.
// It almost looks like a "radar"
vec4 rotating_line()
{
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    float width = 0.0020;
    // Circle relative to center
    float theta0      = 90.0;
    theta0            = theta0 * u_time;
    float theta0_rads = theta0 * (M_PI / 180.0);

    float radius = 0.3;

    vec2 center = vec2(0.5);

    vec2 d = st - center;

    vec2 old_st         = st;
    st                  = rotate(st, theta0_rads, center);
    vec3 rotated_line_b = (vec3(line(st, center, vec2(center.x + radius, center.y), width)));

    float angle_before_rotation = atan(d.y, d.x);

    float angle_before_rotation_in_degrees = (angle_before_rotation) * ((180.0) / M_PI);
    // Add how many degrees we have rotated the line by  (theta0)
    float angle_after_rotation_in_degrees = angle_before_rotation_in_degrees + theta0;
    float theta                           = mod(angle_after_rotation_in_degrees, 360.0);
    float gradient                        = clamp(1.0 - theta / 90.0, 0.0, 1.0);

    float current_radius = length(d);
    if (current_radius > radius)
    {
        gradient *= 0.0;
    }

    return vec4((vec3(rotated_line_b)) + (gradient * blue1), 1.0);
}

void main()
{
    vec4 outputVec = vec4(0.5);
    vec2 st        = gl_FragCoord.xy / u_resolution;

    outputVec = rotating_line();

    gl_FragColor = outputVec;
}