import express from "express";
import mongoose from "mongoose";
import { ConnectOptions } from "mongoose";
import cors from "cors";
import helmet from "helmet";
import { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import fs from "fs";
import dotenv from 'dotenv';
import path from "path";
import rateLimit from 'express-rate-limit';
import { router } from "./routes";
dotenv.config()
// 600 req->per one ip in -> 1 min
//dont know wheter requests come form one ip or multiple

const app = express();
const limiter = rateLimit({
    windowMs: 1*60*1000, 
    max: 600, 
    message: "Too many requests from this IP, please try again later."
  });
app.use(express.json());
app.use(express.urlencoded());
app.use(helmet());
app.use(morgan("common"));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(limiter);
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use("/",router);
const PORT: string = process.env.PORT || "3000";
const MONGO_URL: string =process.env.MONGO_URL ||"mongodb://localhost:27017/mydatabase"; /*for docker based port*/
        console.log(process.env.MONGO_URL);
mongoose
        .connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 100 
        }as ConnectOptions)
        .then(() => {
            app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
        })
        .catch((error) =>
            console.log(`${error} did not 
            connect`)
        );

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
