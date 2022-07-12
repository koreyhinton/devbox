#!/bin/python3

def solve(a_gravity, m_wind, v_wind, area):
    a_wind = v_wind * v_wind # v=m/s; a = (m/s)^2 = v^2 = v*v
    # wind formula:
    #     F_wind = square_meter_area * (m * a)
    #     https://sciencing.com/convert-wind-speed-force-5985528.html
    F = area * m_wind * a_wind
    # other wind formulas (more complex):
    #     https://www.rds.oeb.ca/CMWebDrawer/Record/646733/File/document
    #     https://www.engineeringtoolbox.com/wind-load-d_1775.html
    # what is the force?
    #     uncomment to print force in newtons:
    #         # print(F, 'N (kg-m/s^2)')
    # gravity formula:
    #   F=ma
    #   https://ux1.eiu.edu/~cfadd/3050/Ch04Nwtn/F%3Dma.html
    m_cloak = F / a_gravity
    return m_cloak

if __name__ == '__main__':
    impact_area = 0.8  # square meter
    wind_mph = 104  # miles per hour
    wind_metps = wind_mph / 2.237  # 46.4908359409924 m/s
    kg = solve(a_gravity=9.8, m_wind=1.229, v_wind=wind_metps, area=impact_area)
    lbs = 2.2 * kg
    print(kg, 'kg', ('('+str(lbs)), 'lbs)')
