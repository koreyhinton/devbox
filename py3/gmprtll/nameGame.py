#!/bin/python3

uname = input("Please tell me your name: ")
print("I will shout your name", uname.upper())
print("Now all in lowercase", uname.lower())
print("How about inverting case?", uname.swapcase())
nchars = len(uname)
print("Your name has", nchars, "characters")
print("Now I'll pronounce your name like a cartoon character")
uname = uname.upper()
uname = uname.replace("R", "W")
uname = uname.title()
print(uname)
