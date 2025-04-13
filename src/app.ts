/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorHandlear';
import session from 'express-session';
  
const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [ 'http://localhost:5173'],  
    credentials: true,
  })
);

app.use(
  session({
    secret: "changeit",                
    resave: false,                     
    saveUninitialized: true,           
    cookie: { maxAge: 2 * 60 * 1000 },
  })
);


app.use('/uploads', express.static('uploads'));  
  
app.use("/api/v1", router)



app.get("/",(req, res)=>{
  res.send({message : "server running successfully"})
})


app.use(globalErrorHandler);

export default app;
