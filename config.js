module.exports = {
  aws_table_name: 'eventsTable',
  // Config the local dynamodb
  local: {
    accessKeyId: 'foo',
    secretAccessKey: 'bar',
    region: 'local',
    endpoint: 'http://dynamodb-container:8000'
  },
  test: {

  }
};
