import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import router from './routes/questionRoutes';
import router3 from './routes/meetupRoutes';
import error from './helpers/errorHandler';

const app = express();

app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/api/v1', router, router3);


app.all('*', (req, res) => {
  res.redirect(301, '/api/v1');
});
app.use((err, req, res, next) => {
  error(err, res);
});
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Server running on ${port}`));

export default server;

