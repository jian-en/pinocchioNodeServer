# point to where test dynamodb is
export NPM_TEST="http://localhost:8020"

# unncomment for debug messages in tests
#export DEBUG="true"

# start test instance
docker-compose -f docker-test.yml up -d --build --remove-orphans

# create/delete tables in test db
npm run create-tables

# load test data
npm run load-test-data

# run tests
mocha --timeout 10000 --exit 'src/tests/*.js'

# cleanup
npm run delete-tables
docker-compose -f docker-test.yml down
