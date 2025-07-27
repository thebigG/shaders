#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform float u_time;

float get_distance_field(int number_of_sides, vec2 pos, vec2 st)
{
    // TODO:Need to figure out how to use pos for distance fields...
    float d = 0.0;

    float x_offset = 0.2;
    float y_offset = 0.2;

    st.x *= u_resolution.x / u_resolution.y;

    st.x = smoothstep(pos.x, pos.x + x_offset, st.x);
    st.y = smoothstep(pos.y, pos.y + y_offset, st.y);

    // Remap the space to -1. to 1.
    st = st * 2. - 1.;

    // Number of sides of your shape
    int N = number_of_sides;

    // Angle and radius from the current pixel
    float a = atan(st.x, st.y) + PI;
    float r = TWO_PI / float(N);

    d = cos(floor(.5 + a / r) * r - a) * (length(st));
    return d;
}

// Reference to
// http://thndl.com/square-shaped-shaders.html

// Draws the logo of a computer compnay
vec3 get_computer_company_logo(vec2 st)
{
    float d1 = get_distance_field(4, vec2(0.83, 0.5), st);
    float d2 = get_distance_field(4, vec2(0.9, 0.5), st);
    float d3 = get_distance_field(4, vec2(0.83, 0.43), st);
    float d4 = get_distance_field(4, vec2(0.9, 0.43), st);

    vec3 color = vec3(1.0 - smoothstep(.40, 0.41, d1)) * vec3(1.0, 0.0, 0.0);
    color += vec3(1.0 - smoothstep(.40, 0.41, d2)) * vec3(0.0, 1.0, 0.0);

    color += vec3(1.0 - smoothstep(.40, 0.41, d3)) * vec3(0.0, 0.0, 1.0);

    color += vec3(1.0 - smoothstep(.40, 0.41, d4)) * vec3(1.0, 1.0, 0.0);

    return color;
}

void main()
{
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    // color = vec3(d1);
    // color += vec3(d2);

    gl_FragColor = vec4(get_computer_company_logo(st), 1.0);
}
