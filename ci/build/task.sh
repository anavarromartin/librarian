#!/bin/bash

set -ex

# cd ./librarian/react_app

# yarn global add create-react-app
# yarn
# CI="true" yarn test

# yarn build

# cd ../..

cp -rf ./librarian/. ./updated-gist/

rm -rf updated-gist/react_app/.gitignore updated-gist/.git

cp -rf resource-gist/.git updated-gist/.git

git config --global user.email "concourse@example.com"
git config --global user.name "Concourse"

git add .
git commit -m "New Build"
