#!/bin/bash

PATH=$({
    echo -n "$PATH"
    echo -n :/k/adm/bin
    echo -n :/k/git/bin
    echo -n :/k/gpx/bin
    echo -n :/k/svg/bin
    echo -n :/home/$USER/.local/bin/
    echo -n :/usr/local/go/bin
} | cat)

export GPG_TTY="$(tty)"
