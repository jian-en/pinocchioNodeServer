const jquerycsv = require('jquery-csv');
const fs = require('fs');

// load csv file into dictionary
module.exports.loads = (filepath) => {
  const csvFile = fs.readFileSync(filepath, 'UTF-8');
  return jquerycsv.toObjects(csvFile);
};
