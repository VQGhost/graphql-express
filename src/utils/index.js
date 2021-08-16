import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const secret = process.env.SECRET;

export const getUserId = (req) => {
  const header = req.get("authorization");
  if (header) {
    const token = header.replace("Bearer ", "");
    const { userId } = jwt.verify(token, secret);

    return userId;
  }

  throw new Error("Authentication required");
};

export const hashPassword = async (password) => {
  if (password.length < 6)
    throw new Error("Password must be 6 characters or longer");

  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const validatePassword = async (reqPassword, password) => {
  return await bcrypt.compare(reqPassword, password);
};

export const generateToken = (userId) => {
  return jwt.sign({ userId }, secret, { expiresIn: "2 days" });
};
