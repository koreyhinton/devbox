#!/bin/python3

meat = "salami"
print(meat)
print("slice | result") 
print("------+-------")
print("[2:5] |",meat[2:5])
print("[:3]  |",meat[:3])
print("[2:]  |", meat[2:])
print("[-3:] |",meat[-3:])
print("[1]   |"  ,meat[1])

# salami
# slice | result
# ------+-------
# [2:5] | lam
# [:3]  | sal
# [2:]  | lami
# [-3:] | ami
# [1]   | a
