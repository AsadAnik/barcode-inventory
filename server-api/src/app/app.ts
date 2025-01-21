import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { notFoundMiddleware, errorHandlerMiddleware } from './error';
import middleware from './middleware';
import routes from './routes';
const app = express();

app.use(middleware);
app.use(routes);
app.use('*', notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;