import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';

import cors from 'cors';

import 'dotenv/config';

const app = express();

const { json } = express;
const { connect } = mongoose;

const baseURL = process.env.API_BASE_URL;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbUrl = process.env.DB_URL;
const connectionUrl = `mongodb+srv://${dbUser}:${dbPassword}@${dbUrl}`;

// middleware
app.use(json());
app.use(morgan('tiny'));
app.use(cors());
app.options('*', cors());

// routers
app.use(`${baseURL}/products`, productsRouter);
app.use(`${baseURL}/categories`, categoriesRouter);

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

app.listen(3000, () => {
  console.log('server is running http:///localhost:3000');
});
