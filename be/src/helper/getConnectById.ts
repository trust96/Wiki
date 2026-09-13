import { Prisma } from "@prisma/client";
export const getConnectById = (id: string | number): any => {
  if (id) {
    const idValue = Number.isNaN(Number(id)) ? id : Number(id);
    return {
      connect: {
        id: idValue,
      },
    };
  }
  return undefined;
};
