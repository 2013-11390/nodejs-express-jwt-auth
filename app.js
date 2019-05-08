const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes/index');

app.use(bodyParser.json());
app.use('/', routes);

const sequelize = require('./models').sequelize;
sequelize.sync();
 
const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('앱은 http://%s:%s 에서 작동 중입니다.', host, port);
});