import path from 'path'
import express from "express";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.PORT);
import { app, __dirname } from "./app.js";
import { connectDB } from "./config/db.js";

if (process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '/frontend/dist')))
  //any route that not api will be redirected to index.html
  app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'frontend','dist', 'index.html'))
  })
}
else{
  app.get('/', (req, res)=>{
    res.send('Api is running...')
  })
}

const port = process.env.PORT || 8001;
const host = process.env.HOST;

connectDB();

const server = app.listen(port, host, () => {
  console.log(`Server is listening on port ${port}`);
});
