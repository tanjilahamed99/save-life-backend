import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';
import { AdminModel } from '../models/admin.model.js';
import Email from '../lib/email/emai.js';
import { generateOtpEmail } from '../static/email/otp.template.js';
import { welcomeEmailTemplate } from '../static/email/welcomeEmailTemplate.js';
import viagraAdminModel from '../models/viagra.admin.js';

// admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await AdminModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        status: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user?._id),
        },
      });
    } else {
      res
        .status(202)
        .json({ status: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(202).json({ status: false, message: error.message });
  }
};
// viagra admin login
export const viagraAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await viagraAdminModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        status: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user?._id),
        },
      });
    } else {
      res
        .status(202)
        .json({ status: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(202).json({ status: false, message: error.message });
  }
};

export const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await AdminModel.findOne({ email });
    if (userExists) {
      return res
        .status(202)
        .json({ status: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await AdminModel.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        status: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
      });
    }
  } catch (error) {
    res.status(201).json({ status: false, message: error.message });
  }
};

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password, site } = req.body;

    // Check if user exists
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res
        .status(202)
        .json({ status: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      const htmlContent = await welcomeEmailTemplate({
        name,
        site,
      });

      try {
        await new Email(user, site).sendEmailTemplate(
          htmlContent,
          `Welkom bij ${site}`
        );
      } catch (err) {
        console.log(err);
      }

      res.status(201).json({
        status: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    }
  } catch (error) {
    res.status(201).json({ status: false, message: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await UserModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        status: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user),
        },
      });
    } else {
      res
        .status(202)
        .json({ status: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(202).json({ status: false, message: error.message });
  }
};

// forget password
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Check for user email
    const user = await UserModel.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(202).json({ status: false, message: 'User not found' });
    }
    if (user) {
      // 	// Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      const htmlContent = await generateOtpEmail({ name: user.name, otp: otp });

      try {
        await new Email(user).sendEmailTemplate(
          htmlContent,
          'Password Reset OTP'
        );
      } catch (err) {
        console.log(err);
      }

      // save otp to database
      await UserModel.updateOne({ email }, { $set: { otp } });
      res.status(200).json({ status: true, message: 'OTP sent successfully' });
    }
  } catch (error) {
    res.status(202).json({ status: false, message: error.message });
  }
};

// verify otp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    // Check for user email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(202).json({ status: false, message: 'Invalid OTP' });
    }
    if (user) {
      if (user.otp == otp) {
        res
          .status(200)
          .json({ status: true, message: 'OTP verified successfully' });
      } else {
        res.status(202).json({ status: false, message: 'Invalid OTP' });
      }
    }
  } catch (error) {
    res.status(202).json({ status: false, message: error.message });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  const { otp, email, password } = req.body;
  // Check for user email
  const user = await UserModel.findOne({ email, otp });
  if (!user) {
    return res.status(202).json({ status: false, message: 'User not found' });
  }
  if (user) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // remove otp from database and update password

    await UserModel.updateOne(
      { email },
      { $set: { password: hashedPassword }, $unset: { otp: '' } }
    );
    res
      .status(200)
      .json({ status: true, message: 'Password reset successfully' });
  }
};

// Generate JWT
const generateToken = (user) => {
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  return jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
