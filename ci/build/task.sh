#!/bin/bash

set -ex

# cd ./librarian/react_app

# yarn global add create-react-app
# yarn
# CI="true" yarn test

# yarn build

# cd ../..

mkdir updated-gist
cp -r librarian/* updated-gist/*

ls -lR updated-gist