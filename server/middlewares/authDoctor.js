import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized please login" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    req.doctor = decode.id;
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error });
  }
};

export default authDoctor;
