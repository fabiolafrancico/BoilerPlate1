import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from '@s-routes/index';
import usersRouter from '@s-routes/users';

import  webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import  webpackConfig  from '../webpack.dev.config';
const env = process.env.NODE_ENV || 'development';
var app = express();
if(env ==='development'){
  console.log('>Excecuting in Development Mode: webpack Hot Reloading');

webpackConfig.entry =['webpack-hot-middleware/client?reload=true&timeout=1000', webpackConfig.entry];
webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin);

const compiler = webpack(webpackConfig);

app.use(WebpackDevMiddleware(compiler,{
  publicPath: webpackConfig.output.publicPath
}));
app.use (WebpackHotMiddleware(compiler));
}else{
console.log ('>Executing in production Mode ..');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..','public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;