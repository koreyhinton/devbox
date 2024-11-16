#!/bin/bash

PATH=$({
    echo -n "$PATH"
    echo -n :/k/adm/bin
    echo -n :/k/git/bin
    echo -n :/k/gpx/bin
    echo -n :/k/svg/bin
    echo -n :/home/$USER/.local/bin/
    echo -n :/usr/local/go/bin
    echo -n :/k/phot
    echo -n :/k/repos/koreyhinton.com/ns
    echo -n :/k/repos/kh/sv
} | cat)

export GPG_TTY="$(tty)"
. /k/adm/.secprofile # var exports: OLD_LINUX_BOX_USER,OLD_LINUX_BOX_IP,WEB_BOX_USER,WEB_BOX_HOSTNAME,WB,LINODE_CLI_TOKEN,LINODE_CLI_OBJ_ACCESS_KEY,LINODE_CLI_OBJ_SECRET_KEY,LND_REG,SMB_SRV,SMB_USR,SMB_PTH,SMB_PIC,PRINT_IP
