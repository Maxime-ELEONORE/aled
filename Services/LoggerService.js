import {json} from 'express';

const loggerMiddleware = (req, res, next) => {
  const currentDatetime = new Date();
  const formattedDate = currentDatetime.toISOString();
  const method = req.method;
  const url = req.url;
  const status = res.statusCode;
  let body = {};
  if (req.body && Object.keys(req.body).length > 0) {
    body = req.body;
  }
  if (body !== {}) {
    console.log(`[${formattedDate}] ${method}:${url} ${status} - Body: ${JSON.stringify(body)}`);
  } else {
    console.log(`[${formattedDate}] ${method}:${url} ${status}`);
  }
  next();
};

export default loggerMiddleware;
