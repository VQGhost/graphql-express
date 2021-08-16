import { getUserId } from "../utils";

const Query = {
  hello: (args) => {
    const { name } = args;
    return `Hello ${name || "world"}`;
  },
  quantity: () => 1,
  user: async ({ id }, { req, prisma }) => {
    getUserId(req);
    if (!id) {
      return prisma.users.findMany();
    }
    return prisma.users.findMany({
      where: {
        id: Number(id),
      },
    });
  },
  author: ({ id, first, skip, orderBy }, { req, prisma }) => {
    getUserId(req);
    if (!id) {
      return prisma.authors.findMany({
        first,
        skip,
        orderBy,
      });
    }
    return prisma.authors.findMany({
      where: {
        id: Number(id),
      },
    });
  },
  book: ({ id, first, skip, orderBy }, { req, prisma }) => {
    getUserId(req);
    if (!id) {
      return prisma.books.findMany({
        first,
        skip,
        orderBy,
      });
    }
    return prisma.books.findMany({
      where: {
        id: Number(id),
      },
    });
  },
};

export default Query;
