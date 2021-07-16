import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import usersRouter from './routes/users.js';
import path from 'path';
import { fileURLToPath } from 'url';

import 'dotenv/config';
import { authJwt } from './util/jwt.js';
import { errorHandler } from './util/error.js';
import ordersRouter from './routes/orders.js';

const app = express();

const { json } = express;
const { connect } = mongoose;

const baseURL = process.env.API_BASE_URL;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbUrl = process.env.DB_URL;
const connectionUrl = `mongodb+srv://${dbUser}:${dbPassword}@${dbUrl}`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
app.use('/public/upload', express.static(__dirname + '/public/upload'));

// routers
app.use(`${baseURL}/products`, productsRouter);
app.use(`${baseURL}/categories`, categoriesRouter);
app.use(`${baseURL}/users`, usersRouter);
app.use(`${baseURL}/orders`, ordersRouter);

connect(connectionUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Database Connected!');
  })
  .catch((err) => {
    console.log(err);
  });

// Prod
var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log('Express is working on port ' + port);
});
