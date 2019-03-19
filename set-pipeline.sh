fly --target local login --concourse-url http://127.0.0.1:8080 -u admin -p admin;
fly --target local sync;
fly -t local set-pipeline -p librarian -c pipeline.yml -l credentials.yml --check-creds;
