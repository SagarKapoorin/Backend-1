import { Request, Response } from "express";
import { trackFailedRequest } from "../helpers/trackfailed";
import dotenv from "dotenv";
dotenv.config()
export const submitHandler = async (req: Request, res: Response): Promise<void> => {
    // console.log("Request received");
    const { headers } = req;
    const requiredToken = process.env.ACCESS_TOKEN;
    if (!headers.authorization || headers.authorization !== `Bearer ${requiredToken}`) {
        const reason = !headers.authorization? "Missing Authorization Header": "Invalid Access Token";
        //time to send failed request as it come due to missing ,header or access
        if(req.ip)
        await trackFailedRequest(req.ip, reason);//redis storing of ip
        res.status(401).json({ error: reason });
        return;
    }
    res.status(200).json({ message: "Request processed successfully" });
};
