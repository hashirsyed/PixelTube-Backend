// const { secret } = require("../constants");
const config = require("../config");
const { Users } = require("../models");
const { Channels } = require("../models");
const { generateErrorInstance } = require("../utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
const moment = require("moment");
module.exports = {
  signUp: async function (req, res) {
    try {
      const { name, email, password, dob, profileUrl } = req.body;
      if (!name && !email && !password && !dob) {
        throw generateErrorInstance({
          status: 404,
          message: "Required fields cannot be empty",
        });
      }

      let user = await Users.findOne({
        where: {
          email,
        },
      });

      if (user) {
        throw generateErrorInstance({
          status: 409,
          message: "User already exist with this email",
        });
      }
      const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

      if (!dob.match(dateFormat)) {
        throw generateErrorInstance({
          status: 409,
          message: "Invalid date format. Expected format is YYYY-MM-DD.",
        });
      }
      const date = moment(dob, "YYYY-MM-DD", true);

      // Check if the date is valid
      if (!date.isValid()) {
        throw generateErrorInstance({
          status: 409,
          message: "Invalid date. The date does not exist.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      user = await Users.create({
        name,
        email,
        password: hashedPassword,
        dob,
        profileUrl,
      });
      user = await user.toJSON();
      const token = jwt.sign(user, config.get("jwt_secret"), {
        expiresIn: "365d",
      });
      let channel = Channels.findOne({
        where: {
          fkUserId: user.id,
        },
      });
      if (channel) {
        channel = true;
      } else {
        channel = false;
      }

      res.status(201).send({ user, channel, token });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw generateErrorInstance({
          status: 400,
          message: "Required fields can't be empty",
        });
      }

      let user = await Users.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw generateErrorInstance({
          status: 404,
          message: "User not found",
        });
      }

      const passwordMatched = await bcrypt.compare(password, user.password);
      if (!passwordMatched) {
        throw generateErrorInstance({
          status: 401,
          message: "Invalid Password",
        });
      }

      user = await user.toJSON();
      delete user.password;

      const token = jwt.sign(user, config.get("jwt_secret"), {
        expiresIn: "365d",
      });

      let channel = Channels.findOne({
        where: {
          fkUserId: user.id,
        },
      });
      if (channel) {
        channel = true;
      } else {
        channel = false;
      }
      return res.status(200).send({ user, channel, token });
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .send(err.message || "Something went wrong!");
    }
  },
  getMyProfile: async (req, res) => {
    try {
      let { userId } = req.params;
      let user = await Users.findByPk(userId);
      res.status(201).send(user);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  deleteImage: async function (req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        throw generateErrorInstance({
          status: 404,
          message: "User ID is required",
        });
      }

      let user = await Users.findByPk(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }

      user.profileUrl = null;
      await user.save();

      res.status(200).send({ message: "Profile Image deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  google: async function (req, res) {
    try {
      const { googleAuthorizationToken, flow } = req.body;

      let payload;
      if (flow === "implicit") {
        const tokenInfo = await client.getTokenInfo(googleAuthorizationToken);
        payload = tokenInfo;
      } else {
        const ticket = await client.verifyIdToken({
          idToken: googleAuthorizationToken,
          audience: config.get("googleClientId"),
        });
        payload = ticket.payload;
        console.log(ticket);
      }

      const googleSub = payload.sub;
      const email = payload.email;
      const picture = payload.picture;
      const name = payload.name;

      let user = await Users.findOne({
        where: {
          email,
        },
      });
      if (user) {
        user = await user.update({
          googleSub,
        });
      } else if (!user) {
        user = await Users.create({
          name,
          email,
          profileUrl: picture,
        });
      }
      user = await user.toJSON();
      const token = jwt.sign(user, config.get("jwt_secret"), {
        expiresIn: "365d",
      });
      res.status(201).send({ user, token });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
};
