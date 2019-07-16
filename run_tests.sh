# point to where test dynamodb is
export NPM_TEST="http://localhost:8020"

# unncomment for debug messages in tests
export DEBUG="true"

# start test instance
docker-compose -f docker-test.yml up -d

# create/delete tables in test db
npm run create-tables

# load test data
node src/tests/testData/loadData.js

# run tests
mocha --timeout 10000 --exit 'src/tests/*.js'

# cleanup
npm run delete-tables
docker-compose -f docker-test.yml down