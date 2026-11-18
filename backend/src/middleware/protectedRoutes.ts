import { NextFunction, Response, Request } from "express";
import { EApiCode, USER_ROLE } from "../helper/constants";

const auth = (...roles: Array<USER_ROLE>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = req.session;
    if (!session.user) {
      res.fail({ status: 401, code: EApiCode.Unauthorized });
      return;
    }

    const user = req.session.user;
    const isAuth = roles?.every((role) => role >= user.role);
    if (roles.length && !isAuth) {
      res.fail({ status: 401, code: EApiCode.Forbidden });
      return;
    }

    return next();
  };
};
export default auth;
