#!/bin/bash

set -ex

apt-get update -y
apt-get install zip sqlite3 libsqlite3-dev -y

cd librarian

pip install -r requirements.txt
flask db upgrade
flask test

cd react_app

yarn global add create-react-app
yarn
CI="true" yarn test

yarn build

rm -rf node_modules
rm .gitignore

cd ..

cp -rf ../resource-gist-dev/.git ../updated-gist/.git
zip -r ../librarian.zip .

cd ..

mv librarian.zip updated-gist

cd updated-gist

git config --global user.email "concourse@example.com"
git config --global user.name "Concourse"

git add .
git commit -m "New Build"
