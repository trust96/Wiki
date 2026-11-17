import prisma from "../src/helper/prisma.ts";

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
    take: 5,
  });

  console.log(JSON.stringify(users, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
