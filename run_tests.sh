npm run delete-tables
npm run create-tables
node src/tests/testData/loadData.js
NODE_ENV=test NPM_TEST=http://localhost:8020 mocha --timeout 10000 --exit 'src/tests/*.js'
npm run delete-tables