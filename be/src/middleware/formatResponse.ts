import { NextFunction, Response, Request } from "express";

const formatResponse = (req: Request, res: Response, next: NextFunction) => {
  const send = res.json;
  res.json = (body) => {
    if (res.statusCode > 300) {
      const result = {
        ok: false,
        message: body.message,
        data: null,
      };
      return send.call(res, result);
    }
    const { message, data } = body;
    const result = {
      ok: true,
      data: data ?? null,
      message: message,
    };

    return send.call(res, result);
  };
  next();
};

export default formatResponse;
