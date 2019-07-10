module.exports = {
  aws_table_name: 'eventsTable',
  // Config the local dynamodb
  local: {
    dynamodb: {
      accessKeyId: 'foo',
      secretAccessKey: 'bar',
      region: 'local',
      endpoint: 'http://dynamodb-container:8000',
    },
    jwtSecret: 'pinocchioxdata61',
    mailAuth: {
      user: 'xxx@gmail.com',
      password: 'password'
    }
  },
  test: {

  }
};
