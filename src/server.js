const express = require('express');
const app = express();
const morgan = require('morgan');
const routes = require('./routes');
const postgres = require('./modules/pg/postgres');
const databaseMiddleware = require('./middlewares/databaseMiddleware');
const customErrorMiddleware = require('./middlewares/customErrorMiddleware');
const path = require('path');

async function server(mode) {
  try {
    app.listen(process.env.PORT || 80, () =>
      console.log(`SERVER READY ${process.env.PORT || 80}`)
    );

    const db = await postgres();

    await databaseMiddleware(db, app);

    app.use(customErrorMiddleware);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(express.static(path.join(__dirname, 'public')));

    if (mode == 'dev') {
      app.use(morgan('dev'));
    }
  } catch (error) {
    console.log('SERVER ERROR', error);
  } finally {
    routes(app);
  }
}

module.exports = server;
