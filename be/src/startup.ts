import prisma from "./helper/prisma.js";

const startUp = async () => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
    take: 5,
  });
  console.log("Prisma users:", users);
};

export default startUp;
