#!/bin/python3

# Enclosure Config
class EC:
    def __init__(self, securedInd, stallmates, percentByCold, percentByWolves):
        self.securedInd = securedInd
        self.stallmates = stallmates
        self.percentByCold = percentByCold
        self.percentByWolves = percentByWolves

def solve(configs):
    def sum_percents(confs):
        sum = 0
        for ec in confs:
            sum += ec.percentByCold
            sum += ec.percentByWolves
        return sum
    def sum_config_percents(confs, securedInd, stallmates):
        sum = 0
        for ec in confs:
            if ec.securedInd == securedInd and ec.stallmates == stallmates:
                sum += ec.percentByWolves
                sum += ec.percentByCold
        return sum
    totalHorses = 1000
    percentPerMonth = sum_percents(configs)
    nextMonthTotal = totalHorses - ((percentPerMonth/100.0) * totalHorses)
    month2Total = nextMonthTotal - ((percentPerMonth/100.0) * nextMonthTotal)
    if (month2Total >= 700):
        print("Keep the coin U+0 config")
        return
    splus0 = sum_config_percents(configs, 'S', 0)
    uplus1 = sum_config_percents(configs, 'U', 1)
    # config with the least deaths is the winner
    if splus0 * 2 < uplus1 * 2:
        print("Secure fence S+0 config")
    else:
        print("Buy a stallmate U+1 config")

if __name__ == '__main__':
    configs = [EC('U',0,6,11),EC('U',1,2,2),EC('S',0,3,2),EC('S',1,1,1)]
    solve(configs)
