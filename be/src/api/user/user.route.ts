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
import validate from "../../middleware/validationMiddleware";
import {
  createUserRequestSchema,
  updateUserRequestSchema,
  changePasswordRequestSchema,
} from "@wiki/api-contracts";

const userRouter = Router();

userRouter.get("/user", auth(), getAllUsersController);
userRouter.get("/user/:id", auth(), getUserController);
userRouter.post("/user", auth(), validate(createUserRequestSchema), createUserController);
userRouter.put("/user/:id", auth(), validate(updateUserRequestSchema), updateUserController);
userRouter.put(
  "/user/password/:id",
  auth(),
  validate(changePasswordRequestSchema),
  changePasswordController,
);
userRouter.delete("/user/:id", auth(), deleteUserController);

export default userRouter;
