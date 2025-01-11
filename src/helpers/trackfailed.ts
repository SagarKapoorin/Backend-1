import * as redis from "redis";
import { sendAlert } from "./mailer";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { FailedRequest } from "../models";

dotenv.config();
// console.log(process.env.REDIS_URL)
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});
redisClient.on('connect', () => {
    console.log('Redis is connected');
});
redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
redisClient.connect().catch((err) => {
    console.error('Failed to connect to Redis:', err);
  });

const Threshold = 10;
const Redis_size = 100;

export const trackFailedRequest = async (ip: string, reason: string) => {
    const key = `failed:${ip}`;
    const attempts = await redisClient.incr(key);
    const size = await redisClient.dbSize();
    console.log(size + " redis-size");
    
    if (attempts > Redis_size) {
       redisFun(reason);
    }
    
    if (attempts >= Threshold) {
        // console.log("nodemailer");
        sendAlert(ip, attempts);
    }    
};
export const redisFun=async(reason:string)=>{
    const keys = await redisClient.keys('failed:*');
        
    if (keys.length > 0) {
        const pipeline = redisClient.multi();
        const failedRequests = await Promise.all(keys.map(async (key) => {
            const attempts = await redisClient.get(key); 
            const ip = key;
            pipeline.del(key); 
            return {
                ip,
                reason, 
                count: attempts
            };
        }));
        
        await pipeline.exec(); 
        await FailedRequest.insertMany(failedRequests.filter(request => request)); 
    }
}
