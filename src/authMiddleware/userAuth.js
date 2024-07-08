require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { ValidationError, NotFoundError } = require("../helper/error");

const authUser = async (request, response, next) => {
  try {
    // accept token from user
    let token = request.headers.Authorization;
    if (!token) {
      throw new ValidationError("Token is required");
    }
    //docode verify token
    token = token.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_JWT);
    // check if user exist
    let user = await User.findOne({ role: decodedToken.role });
    if (!user || decodedToken.role !== "librarian") {
      throw new NotFoundError("User not found");
    }
    request.user = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authUser;
