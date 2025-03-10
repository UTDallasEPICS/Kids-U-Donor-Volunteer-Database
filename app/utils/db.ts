import { Prisma, PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};
const prismaSoftDelete = new PrismaClient().$extends({
  model: {
    $allModels: {
      async delete<M, A>(this: M, where: Prisma.Args<M, "delete">): Promise<Prisma.Result<M, A, "update">> {
        const context = Prisma.getExtensionContext(this);

        return (context as any).update({
          ...where,
          data: {
            deletedAt: new Date(),
            status: false,
          },
        });
      },
    },
  },
});
export { prismaSoftDelete };
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export default prisma;
