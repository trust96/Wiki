import { NextFunction, Response, Request } from "express";
import { EApiCode, USER_ROLE } from "../helper/constants";

const auth = (...roles: Array<USER_ROLE>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = req.session;
    if (!session.user) {
      res.status(401).json({ code: EApiCode.Unauthorized });
      return;
    }

    const user = req.session.user;
    const isAuth = roles?.every((role) => role >= user.role);
    if (roles.length && !isAuth) {
      res.status(401).json({ code: EApiCode.Forbidden });
      return;
    }

    return next();
  };
};
export default auth;
