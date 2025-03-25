import User from "../models/userModel.js";
import errorHandler from "./../utils/errorHandller.js";
import bcrypt from "bcryptjs";
import { validator } from "validator";
import jwt from "jsonwebtoken";

const userRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }
    if (!validator.isEmail(email)) {
      return next(errorHandler(400, "Invalid Email"));
    }
    if (password.length < 8) {
      return next(
        errorHandler(400, "Password must be atleast 8 characters long")
      );
    }
    const user = await User.findOne({ email });
    if (user) return next(errorHandler(400, "User already exists"));
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = bcrypt(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res
      .status(201)
      .json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, error.message));
  }
};

export { userRegister };
