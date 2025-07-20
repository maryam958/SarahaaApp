import * as dotenv from 'dotenv' ;
dotenv.config();

import express from 'express';
import * as allRoutes from './modules/index.route.js'
import connection from './DB/connection.js';
const app=express();
const baseURL="/api/v1"


app.use(express.json());
app.use(`${baseURL}/uploads`,express.static("./uploads"))
app.use(`${baseURL}/user`,allRoutes.userRouter);
app.use(`${baseURL}/message`,allRoutes.messageRouter);
app.use(`${baseURL}/auth`,allRoutes.authRouter);
app.use("*", (req, res, next) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Messaging API</title>
      <style>
        * {
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #dbeafe, #f0f9ff);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .card {
          background: white;
          padding: 40px 30px;
          border-radius: 16px;
          box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 500px;
        }
        h1 {
          color: #1d4ed8;
          margin-bottom: 20px;
          font-size: 28px;
        }
        p {
          font-size: 16px;
          color: #444;
          margin-bottom: 30px;
        }
        .btn {
          background: #1d4ed8;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: bold;
          transition: background 0.3s ease;
          display: inline-block;
          margin: 5px;
        }
        .btn:hover {
          background: #1e40af;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>💬 Welcome to Sarahaa the Messaging API</h1>
        <p>This API allows users to send and receive messages in real-time or asynchronously.</p>
        <a href="https://github.com/maryam958/SarahaaApp.git" class="btn" target="_blank">📄 View README on GitHub</a>
      </div>
    </body>
    </html>
  `);
});

connection()

app.listen(3000,()=>{
    console.log("Server is running");
})