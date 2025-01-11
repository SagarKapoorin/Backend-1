import mongoose, { Document } from "mongoose";
import { Request, Response, NextFunction } from "express";
//failed request schema
export interface IFailedRequest extends Document{
  ip: string,
  reason: string,
  count: number,
  timestamp: Date,
}
const FailedRequestSchema =new mongoose.Schema<IFailedRequest>({
  ip: String,
  reason: String,
  count: Number,
  timestamp: Date,
});

export const FailedRequest = mongoose.model<IFailedRequest>(
  "FailedRequest",
  FailedRequestSchema
);
//mongodb rate limit
interface IRateLimit extends Document {
    ip: string;
    requests: number;
    lastRequest: Date;
  }
  
  const RateLimitSchema = new mongoose.Schema<IRateLimit>({
    ip: { type: String, required: true },
    requests: { type: Number, required: true },
    lastRequest: { type: Date, required: true },
  });
  
  
export const RateLimit = mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);