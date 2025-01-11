import { Request, Response } from "express";
import { FailedRequest } from "../models";
import { redisFun } from "../helpers/trackfailed";

export const getMetrics = async (req: Request, res: Response):Promise<void> => {
    redisFun("Missing Authorization Header");
    const metrics = await FailedRequest.aggregate([
        {
            $group: {
                _id: "$ip",
                totalAttempts: { $sum: "$count" },
                reasons: { $addToSet: "$reason" }
            },
        }
    ]);
    res.status(200).json(metrics);
};
