import { Router } from "express";
import { getMetrics } from "../middlewares/getmatrics";
import { submitHandler } from "../middlewares/submit";
import { mongoRateLimit } from "../middlewares/mongoratelimit";
export const router = Router();
//use mogoratelimit only when we know requests came from different ips
//for testing i remove it as middleware
router.get("/api/metrics",getMetrics);
router.post("/api/submit",submitHandler);