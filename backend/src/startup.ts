import prisma from "./helper/prisma";
import { initializeAuth } from "./api/auth/auth.service";

const startUp = async () => {
  await prisma.$connect();
  await initializeAuth();
};

export default startUp;
