#!/bin/python3

name = input("Name? ")
prompt = "%s's age? " % name
age_str = input(prompt)
decades = float(age_str) / 10.0  # float() or int() has the same result since it
                                 # divides by a denominator with a decimal point
                                 # (coercing the int to be converted to a float
                                 # before the divide operation)
print(f"{name} is {decades} decades old")  # formatted-string (py3)
print("%.2f decades = %d years" % (decades, int(age_str)))  # d => digit (int)
#                                       .2 => use 2 digits after decimal point

# Name? Bob
# Bob's age? 32
# Bob is 3.2 decades old
# 3.20 decades = 32 years
