#!/usr/bin/env bash

# generate new key pairs for deployment

if [[ $1 != '-y' ]]; then

  echo 'Are you sure that this command rests application secret key? [y/N]'
  read RESET
  if [[ $RESET != 'y' ]]; then
    exit 0
  fi

fi


if [[ -f ./id_ecdsa ]]; then
  rm ./id_ecdsa
fi

if [[ -f ./id_ecdsa.pub ]]; then
  rm ./id_ecdsa.pub
fi

ssh-keygen -t ecdsa -f ./id_ecdsa -q -N ''
