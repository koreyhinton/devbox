#!/bin/bash

PATH=$({
    echo -n "$PATH"
    echo -n :/k/adm/bin
    echo -n :/k/git/bin
    echo -n :/k/gpx/bin
} | cat)

