docker-compose up -d;
sleep 15;
fly --target tutorial login --concourse-url http://127.0.0.1:8080 -u admin -p admin;
fly --target tutorial sync;
fly -t tutorial set-pipeline -p librarian -c pipeline.yml -l credentials.yml;
