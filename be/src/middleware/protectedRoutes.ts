import { NextFunction, Response, Request } from "express";
import { USER_ROLE } from "../helper/constants";

const auth =
  (...roles: Array<USER_ROLE>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const session = req.session;
    if (!session.user) {
      res.status(401).json({ message: "Non hai effettuato l'accesso." });
      return;
    }
    const user = req.session.user;
    const isAuth = roles?.every((role) => role >= user.role);
    if (roles.length && !isAuth) {
      res.status(401).json({ message: "Non hai il permesso di accedere a questa funzionalita'." });
      return;
    }
    return next();
  };
export default auth;
