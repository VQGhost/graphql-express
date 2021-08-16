import { sync } from "rimraf";
import {
  generateToken,
  hashPassword,
  validatePassword,
  getUserId,
} from "../utils";

const Mutation = {
  signUp: async ({ data }, { prisma }) => {
    const password = await hashPassword(data.password);
    const user = await prisma.users.create({
      data: {
        ...data,
        password,
      },
    });
    return {
      user,
      token: generateToken(user.id),
    };
  },
  login: async ({ data }, { prisma }) => {
    const user = await prisma.users.findFirst({
      where: {
        email: data.email,
      },
    });
    const isValid = await validatePassword(data.password, user.password);
    if (!isValid) {
      throw new Error("Password incorrect");
    }

    return { user, token: generateToken(user.id) };
  },
  updateUser: async ({ id, data }, { req, prisma }) => {
    getUserId(req);

    const { password } = data;

    if (password) {
      data.password = await hashPassword(data.password);
    }

    return prisma.users.update({
      where: { id: Number(id) },
      data,
    });
  },
  createAuthor: async ({ data }, { req, prisma, pubsub }) => {
    getUserId(req);

    const { register_by, ...rest } = data;

    const newAuthor = await prisma.authors.create({
      data: {
        ...rest,
        users: {
          connect: {
            id: Number(register_by),
          },
        },
      },
    });

    pubsub.publish("author", {
      author: {
        mutation: "CREATED",
        data: newAuthor,
      },
    });

    return newAuthor;
  },
  updateAuthor: async ({ data }, { req, prisma, pubsub }) => {
    getUserId(req);
    const { register_by, ...rest } = data;

    if (register_by) {
      rest.users = {
        connect: {
          id: Number(register_by),
        },
      };
    }

    const authorUpdated = await prisma.authors.update({
      where: {
        id: Number(id),
      },
      data: {
        ...rest,
      },
    });

    pubsub.publish("author", {
      author: {
        mutation: "UPDATED",
        data: authorUpdated,
      },
    });

    return authorUpdated;
  },
  createBook: async ({ data }, { req, prisma, pubsub }) => {
    getUserId(req);

    const { writted_by, register_by, ...rest } = data;

    const newBook = await prisma.books.create({
      data: {
        ...rest,
        authors: {
          connect: {
            id: Number(writted_by),
          },
        },
        users: {
          connect: {
            id: Number(register_by),
          },
        },
      },
    });

    pubsub.publish(`book - ${newBook.writted_by}`, {
      book: {
        mutation: "CREATED",
        data: newBook,
      },
    });

    return newBook;
  },
  updateBook: async ({ id, data }, { req, prisma, pubsub }) => {
    getUserId(req);
    const { writted_by, register_by, ...rest } = data;

    if (writted_by) {
      rest.authors = {
        connect: {
          id: Number(writted_by),
        },
      };
    }

    if (register_by) {
      rest.users = {
        connect: {
          id: Number(register_by),
        },
      };
    }

    const bookUpdated = await prisma.books.update({
      where: {
        id: Number(id),
      },
      data: {
        ...rest,
      },
    });

    pubsub.publish(`book - ${bookUpdated.writted_by}`, {
      book: {
        mutation: "UPDATED",
        data: bookUpdated,
      },
    });

    return bookUpdated;
  },
  deleteBook: async ({ id }, { req, prisma, pubsub }) => {
    getUserId(req);
    const bookDeleted = await prisma.books.delete({
      where: {
        id: Number(id),
      },
    });

    pubsub.publish(`book - ${bookDeleted.writted_by}`, {
      book: {
        mutation: "DELETED",
        data: bookDeleted,
      },
    });

    return bookDeleted;
  },
};

export default Mutation;
