require("dotenv").config();
const Mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { ValidationError, NotFoundError } = require("../helper/error");

//register user
exports.createUser = async (request, response, next) => {
  try {
    let { fullname, email, password, role } = request.body;
    if (!fullname || !email || !password) {
      throw new ValidationError("All fields are required");
    }
    //check if user already exist
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ValidationError(
        `User already exist with this email ${existingUser.email}`
      );
    }

    //hash user password
    password = bcrypt.hashSync(password, 10);

    //create new user
    let newUser = new User({
      fullname,
      email,
      password,
      role,
    });
    let savedUser = await newUser.save();
    // remove password and return the new user
    savedUser = savedUser.toJSON();
    delete savedUser.password;
    return response.status(201).json({
      success: true,
      response_message: `User ${savedUser.fullname} has been created successfully`,
      data: savedUser,
    });
  } catch (error) {
    next(error);
  }
};

//login user
exports.login = async (request, response, next) => {
  try {
    let { email, password } = request.body;
    if (!email || !password) {
      throw new ValidationError("All fields are required");
    }
    //check if user exist
    let existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }
    //check password
    let isMatch = bcrypt.compareSync(password, existingUser.password);
    if (!isMatch) {
      throw new NotFoundError(`User password do not match`);
    }
    // create user payload
    const payload = {
      id: existingUser._id,
      role: existingUser.role,
    };
    // generate token
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });
    return response.status(200).json({
      success: true,
      responseMessage: `${existingUser.email} , you logged in successfully`,
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

//search all users
exports.getAllUsers = async (request, response) => {
  try {
    let allUsers = User.find({});
    if (allUsers) {
      return response.status(200).json({
        success: true,
        responseMessage: allUsers,
      });
    }
  } catch (error) {
    next(error);
  }
};

// get single user
exports.singleUser = async (request, response) => {
  try {
    let id_User = request.params.id;
    //validate input
    if (!id_User) {
      throw new ValidationError("User id is required");
    }
    //check if the id is valid
    if (!Mongoose.isValidObjectId(id_User)) {
      throw new NotFoundError(`Invalid user id ${id_User}`);
    }
    let singleUser = await User.findById(id_User);
    return response.status(200).json({
      success: true,
      responseMessage: singleUser,
    });
  } catch (error) {
    next(error);
  }
};

//edit user
exports.editUser = async (request, response) => {
  try {
    let user_id = request.params.id;
    //validate input
    if (!user_id) {
      throw new ValidationError("User id required");
    }
    if (!Mongoose.isValidObjectId(user_id)) {
      throw new ValidationError(`Invalid User ID ${user_id}`);
    }
    // get a user and update
    let updatedUser = await User.findByIdAndUpdate(
      { user_id, ...request.body },
      { new: true }
    );
    if (updatedUser) {
      const { password, ...result } = updatedUser.toJSON();
      return response.status(200).json({
        success: true,
        responseMessage: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

//delete user
exports.deleteUser = async (request, response) => {
  try {
    let user_id = request.params.id;
    if (!user_id) {
      throw new ValidationError("User id required");
    }
    //check if the id is valid
    if (!Mongoose.isValidObjectId(user_id)) {
      throw new ValidationError(`Invalid User ID ${user_id}`);
    }
    //find user and delete
    let deletedUser = await User.findByIdAndDelete(user_id);
    if (deletedUser) {
      return response.status(200).json({
        success: true,
        responseMessage: `User ${deletedUser} is deleted successfully`,
      });
    }
  } catch (error) {
    next(error);
  }
};
