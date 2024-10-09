import HandleError from "./HandleError";
import { Request, Response } from "express";
import { BadRequestError, CustomError } from "../core/error.response";

type BSFunction = (params: { [key: string]: any }) => Promise<any>;

const MessageHandle = async (
  bsfunction: BSFunction,
  req: Request,
  res: Response
) => {
  try {
    const parameters = req.method === "POST" ? req.body : req.query;
    const result = await bsfunction(parameters);
    if (req.method === "POST") {
      res.status(201).json({ result: "success", content: result });
    } else if (req.method === "PUT") {
      res.status(200).json({ result: "success", content: result });
    } else if (req.method === "DELETE") {
      res.status(204).json({ result: "success", content: result });
    } else {
      res.json({ result: "success", content: result });
    }
  } catch (e) {
    // console.log("ERROR: ", e);
    if (e instanceof HandleError) {
      const response = JSON.parse(e.message);
      res
        .status(response?.status)
        .json({ result: "fail", message: response?.message });
    } else if (e instanceof BadRequestError) {
      res.status(400).json({ result: "fail", message: e.message });
    } else if (e instanceof CustomError) {
      res.status(e.status).json({ result: "fail", message: e.message });
    } else {
      res.status(500).json({ result: "fail", message: "Technical Error" });
    }
  }
};

export default MessageHandle;
