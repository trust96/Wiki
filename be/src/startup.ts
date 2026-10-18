import prisma from "./helper/prisma";

const startUp = async () => {
  globalThis.gemmaState = {};

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
    take: 5,
  });
  console.log("Prisma users:", users);
};

export default startUp;
