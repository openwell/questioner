import express from 'express';
import logger from 'morgan';
import router from './routes/meetUpRoute';

const app = express();

app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1', router);


app.all('*', (req, res) => {
  res.redirect(301, '/api/v1');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log('server running'));

export default server;
