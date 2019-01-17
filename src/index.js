import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import questionRoute from './routes/questionRoutes';
import authRoute from './routes/authenticationRoutes';
import meetupRoute from './routes/meetupRoutes';
import commentRoute from './routes/commentRoutes';
import error from './helpers/errorHandler';

const app = express();

app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/api/v1', questionRoute, authRoute, meetupRoute, commentRoute);



app.all('*', (req, res) => {
  res.redirect(301, '/api/v1');
});
app.use((err, req, res, next) => {
  error(err, res);
});
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Server running on ${port}`));

export default server;

