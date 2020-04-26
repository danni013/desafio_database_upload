import express from 'express';
import app from './app';
import routes from './routes';
import uploadConfig from './config/upload';

app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});
