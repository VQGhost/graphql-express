import { getUserId } from "../utils";

const Book = {
  writted_by: (arg, { req, prisma }) => {
    getUserId(req);
    return prisma.books.findFirst();
  },
};

export default Book;
