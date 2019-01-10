#!/bin/bash

set -ex

apt-get install zip

cd ./librarian/react_app

yarn global add create-react-app
yarn
CI="true" yarn test

yarn build

cd ../..

cp -rf resource-gist/.git updated-gist/.git

cd updated-gist

zip -r librarian.zip ../librarian

git config --global user.email "concourse@example.com"
git config --global user.name "Concourse"

git add .
git commit -m "New Build"
