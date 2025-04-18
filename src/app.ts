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
    origin: [ 'http://localhost:5173', 'http://localhost:3000', 'http://192.168.4.42:3000'],  
    credentials: true,
  })
);

// app.use(
//   session({
//     secret: "changeit",                
//     resave: false,                     
//     saveUninitialized: true,           
//     cookie: { maxAge: 2 * 60 * 1000 },
//   })
// );


app.use(
  session({
    secret: "changeit",
    // resave: true,
    // saveUninitialized: true,
    cookie: {
      maxAge: 2 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none', // important for cross-origin cookies
      secure: false,    // set to true if using HTTPS
    },
  })
);


app.use('/uploads', express.static('uploads'));  
  
app.use("/api/v1", router)



app.get("/",(req, res)=>{
  res.send({message : "server running successfully"})
})


app.use(globalErrorHandler);

export default app;
