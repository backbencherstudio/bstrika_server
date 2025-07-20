/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
  reviews? : any
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    reviews : data.reviews
  });
};

export default sendResponse;
