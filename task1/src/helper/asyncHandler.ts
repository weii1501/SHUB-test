import { NextFunction, Request, Response } from "express";

export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return fn(req, res, next).catch(next);
    };
};