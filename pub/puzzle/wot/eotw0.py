#!/bin/python3

from random import randrange

L_PTR = randrange(30)
E_PTR = randrange(38)
l_bytes = list("other Lews Therin memories :-)")  # (corrupt) happy emoticon
e_bytes = list("other Elan Morin Tedronai memories X_X")  # dead person emoticon

def H():
    global e_bytes
    global l_bytes
    # heal the memory (transferring Elan's memory to Lews) at point
    l_bytes[L_PTR] = e_bytes[E_PTR]

def K():
    global L_PTR
    global E_PTR
    # go to Kin memory address
    L_PTR = 30-3  # address of last 3 bytes
    E_PTR = 38-3  # address of last 3 bytes

def I():
    # incremement pointer address
    global L_PTR
    global E_PTR
    L_PTR += 1
    E_PTR += 1

def solve():
    print("Healing memory...KHIHIH")
    K()
    H()
    I()
    H()
    I()
    H()
    return (''.join(l_bytes))[-3:]

if __name__ == '__main__':
    print('Kin Memory: ' + ((''.join(l_bytes))[-3:]))
    print('Kin Memory: ' + solve())

