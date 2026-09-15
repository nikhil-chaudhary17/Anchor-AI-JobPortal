import User from "../models/userSchema.js";
import generateToken from "../utils/generateToken.js";



export const register = async (req, res,next) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "Usera already exists",
        success: false,
      });
    }
   const allowedRoles = ["candidate", "recruiter"];
    const finalRole = allowedRoles.includes(role) ? role : "candidate";

    // create user
    const user = await User.create({ name, email, password, role: finalRole });

    //generate token

    generateToken(res, user._id);

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error)
  }
};




export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    generateToken(res, user._id);

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
        next(error)
  }
};




export const logout = (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};
