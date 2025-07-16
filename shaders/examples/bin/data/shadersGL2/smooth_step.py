
from scipy import arange

def clamp(value, min_value, max_value):
    return max(min_value, min(value, max_value))



def smoothstep(edge0, edge1, x):
    t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def smooth_test():
    width = 1
    height = 1

    for x in arange(0, width+1, 0.01):
        for y in arange(0, height+1, 0.01):
            print(f"input:{abs(x - y)}, output:{smoothstep(0.02, 0.00, abs(x - y))}" )

smooth_test()