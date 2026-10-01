import { NextFunction, Response, Request } from "express";
import { EApiCode } from "@wiki/api-contracts";

type ResponseBody = {
  code?: number | null;
  data?: unknown;
};

const formatResponse = (req: Request, res: Response, next: NextFunction) => {
  const send = res.json;
  res.json = (body: ResponseBody) => {
    if (res.statusCode > 300) {
      const result = {
        ok: false,
        code: body?.code ?? EApiCode.ServerError,
        data: null,
      };
      return send.call(res, result);
    }
    const result = {
      ok: true,
      code: null,
      data: body?.data ?? null,
    };

    return send.call(res, result);
  };
  next();
};

export default formatResponse;
