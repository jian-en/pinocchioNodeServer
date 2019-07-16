npm run delete-tables
npm run create-tables
node src/tests/testData/loadData.js
mocha --timeout 10000 --exit 'src/tests/*.js'
npm run delete-tables