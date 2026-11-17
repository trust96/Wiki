import { Router } from "express";
import { changePasswordController, deleteUserController, getAllUsersController, getUserController, updateUserController } from "./user.controller";
import auth from "../../middleware/protectedRoutes";
import validate from "../../middleware/validationMiddleware";
import { changeforgottenPasswordValidation } from "../auth/auth.helper";

const userRouter = Router();

userRouter.get("/user", auth(), getAllUsersController);
userRouter.get("/user/:id", auth(), getUserController);
userRouter.put("/user/:id", auth(), updateUserController);
userRouter.put("/user/password/:id", auth(), validate(changeforgottenPasswordValidation), changePasswordController);
userRouter.delete("/user/:id", auth(), deleteUserController);

export default userRouter;
