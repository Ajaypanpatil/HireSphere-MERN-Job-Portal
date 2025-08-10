import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Regster the Candidate and Recruiter

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["candidate", "recruiter"].includes(role)) {
    return res
      .status(400)
      .json({ message: "Role must be candidate or recruiter." });
  }

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();

    const payload = { id: user._id, role: user.role };

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error, reguster try again later." });
  }
};

//  Login logic start from here

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and Password is required.." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Password does not match" });
    }

    const payload = { id: user._id, role: user.role };

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Login Error", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

//  get all data about current user

export const getCurrentUser = async (req, res) => {
  try {
    // req.user is populated by protect middleware after JWT verification
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// update current logged in user's profile

// Update current logged-in user's profile
export const updateUserProfile = async (req, res) => {
  const userId = req.user.id; // from auth middleware
  const { name, email } = req.body;

  if (!name && !email) {
    return res
      .status(400)
      .json({
        message: "At least one field (name or email) is required to update.",
      });
  }

  try {
    // Check if email is being updated and if it already exists for another user
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res
          .status(409)
          .json({ message: "Email is already in use by another account." });
      }
    }

    // Update user document partially
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...(name && { name }), ...(email && { email }) },
      { new: true, runValidators: true }
    ).select("-password"); // Exclude password from response

    res.json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
