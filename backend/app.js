import path from 'path'
import express from "express";
import cookieParser from "cookie-parser";
import morgan from 'morgan';
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())


app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)
app.get("/api/config/paypal", (req, res) =>{
  res.send({clientId: process.env.PAYPAL_CLIENT_ID})
})
const __dirname = path.resolve() ///set __dirname to current directory


app.use('/uploads', express.static(path.join( __dirname, '/uploads')))
app.use(errorHandler)

export { app, __dirname };
