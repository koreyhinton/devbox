#!/bin/python3

from math import tan
from math import pi

def solve(fov, nearestDist):
    if fov <= 180:
        raise Exception("Raven will not be seen crossing a field of view <=180")
    if fov >= 360:
        raise Exception("Raven would already be seen by a field of view >=360")
    southFov = fov - 180
    southWestFov = southFov / 2.0  # removes east component of the FOV
    theta = 90 - southWestFov  # angle used in toa (of sohcatoa)
    #
    # -----*------      *       (Egwene)
    #    $/|\S          $       southWestFov
    #    /#|            #       theta
    #   /  |30          @       (raven)
    #  /   |WL          $+S     southFov
    # /    |feet        $+S+180 fov
    #/_____@
    #  opp
    thetaRad = theta * pi / 180
    opp = tan(thetaRad) * nearestDist
    return opp

if __name__ == '__main__':
    fov = 210
    nearestDist = 30
    ans = solve(fov, nearestDist)
    print(ans, 'WL feet')
