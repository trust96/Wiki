import { Router } from "express";
import {
  changePasswordController,
  createUserController,
  deleteUserController,
  getAllUsersController,
  getUserController,
  updateUserController,
} from "./user.controller";
import auth from "../../middleware/protectedRoutes";

const userRouter = Router();

userRouter.get("/user", auth(), getAllUsersController);
userRouter.get("/user/:id", auth(), getUserController);
userRouter.post("/user", auth(), createUserController);
userRouter.put("/user/:id", auth(), updateUserController);
userRouter.put("/user/password/:id", auth(), changePasswordController);
userRouter.delete("/user/:id", deleteUserController);

export default userRouter;
