import { getUserId } from "../utils";

const Author = {
  register_by: (args, { req, prisma }) => {
    getUserId(req);
    return prisma.authors
      .findFirst({
        where: {
          id: parent.id,
        },
      })
      .users();
  },
  books: (args, { req, prisma }) => {
    getUserId(req);
    return prisma.authors
      .findFirst({
        where: {
          id: parent.id,
        },
      })
      .books();
  },
};
