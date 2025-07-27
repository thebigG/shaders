#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  u_resolution;
uniform float u_time;

vec3 rgb2hsb(in vec3 c)
{
    vec4  K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4  p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4  q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb(in vec3 c)
{
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    rgb      = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main()
{
    vec2 st    = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(0.0);

    // We map x (0.0 - 1.0) to the hue (0.0 - 1.0)
    // And the y (0.0 - 1.0) to the brightness

    // vec3 result =  mod((st.x*6.0)+(vec3(0.0,4.0,2.0)),
    //                          6.0);

    // vec3 result =  mod((st.x*6.0)+(vec3(1.0,5.0,2.0)),
    //  6.0);

    // float result =  mod(st.x*6.0, 6.0);

    vec3 result = mod((st.x * 6.0) + vec3(0.5, 1.0, 0.0), 6.0);

    // Same as what is above

    // float result_r =  abs(mod((st.x*6.0) + 1.5, 6.0) - 3.00);
    // float result_g =  abs(mod((st.x*6.0) + 0.0, 6.0) - 3.00);
    // float result_b =  abs(mod((st.x*6.0) + 0.0, 6.0) - 3.00);

    // float result_r =  clamp(abs(mod((st.x*6.0) + 0.0, 6.0) - 3.00)-1.00, 0.0, 1.0);
    // float result_g =  clamp(abs(mod((st.x*6.0) + 4.0, 6.0) - 3.00)-1.00, 0.0, 1.0);
    // float result_b =  clamp(abs(mod((st.x*6.0) + 2.0, 6.0) - 3.00)-1.00, 0.0, 1.0);

    float result_r = clamp(abs(mod((st.x * 6.0) + 0.0, 6.0) - 3.00) - 1.00, 0.0, 1.0);
    float result_g = clamp(abs(mod((st.x * 6.0) + 4.0, 6.0) - 3.00) - 1.0, 0.0, 1.0);
    float result_b = clamp(abs(mod((st.x * 6.0) + 2.0, 6.0) - 3.00) - 1.00, 0.0, 1.0);

    // float result_r =  (mod((st.x*6.0) + 1.5, 6.0) - 3.00);
    // float result_g =  (mod((st.x*6.0) + 0.0, 6.0) - 3.00);
    // float result_b =  (mod((st.x*6.0) + 0.0, 6.0) - 3.00);

    vec3 result_rgb = vec3(result_r, result_g, result_b);

    // result_rgb = result_rgb * result_rgb * (3.0-2.0*result_rgb);
    // float result =  mod(st.x*1.0, 1.0);

    float result_float = mod(u_time, 6.0);
    // result = result_float;
    // color = hsb2rgb(vec3(st.x,1.0,st.y));

    color = vec3(0.0, 1.0, 1.0);

    // result_rgb = st.y * mix(vec3(1.0), result_rgb, 1.0);

    result = result_rgb;

    // result = color;

    gl_FragColor = vec4(result, 1.0);
    // gl_FragColor = vec4(color * result_float,1.0);

    // gl_FragColor = vec4(color * result  ,1.0);
}
