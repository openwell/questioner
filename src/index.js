import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import questionRoute from './routes/questionRoutes';
import authRoute from './routes/authenticationRoutes';
import meetupRoute from './routes/meetupRoutes';
import commentRoute from './routes/commentRoutes';
import returnError from './middleware/errorHandler';

const app = express();

app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/api/v1', questionRoute, authRoute, meetupRoute, commentRoute);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.all('*', (req, res) => {
  res.redirect(301, '/api/v1');
});
app.use((err, req, res, next) => {
  returnError(err, res);
});
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Server running on ${port}`));

export default server;
