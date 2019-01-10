#!/bin/bash

set -ex

cd ./librarian/react_app

yarn global add create-react-app
yarn
CI="true" yarn test

yarn build

cd ../..

cp -r librarian updated-gist
