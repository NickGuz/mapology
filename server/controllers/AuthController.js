const auth = require("../auth");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { User, RecoveryPassword } = require("../sequelize/sequelize");
const nodemailer = require("nodemailer");
const config = require("../config/nodemailer.config");
const { Op } = require("sequelize");
const crypto = require('crypto');

exports.loggedIn = async (req, res) => {
  try {
    let userId = auth.verifyUser(req);
    if (!userId) {
      return res.status(200).json({
        loggedIn: false,
        user: userId,
      });
    }

    const loggedInUser = await User.findByPk(userId);
    console.log("loggedInUser: " + loggedInUser);

    return res.status(200).json({
      loggedIn: true,
      user: loggedInUser,
    });
  } catch (err) {
    console.log("err: " + err);
    res.json(false);
  }
};

exports.login = async (req, res) => {
  console.log("login user");

  try {
    const userInfo = req.body.userInfo;
    const password = req.body.password;
    //check if password field is empty
    if (!userInfo || !password) {
      return res.status(400).json({ errorMessage: "Please enter all required fields." });
    }
    // logging in with username
    const user = await User.findOne({ where: { username: userInfo } });

    if (!user) {
      return res.status(401).json({
        errorMessage: "Wrong email",
      });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      console.log("Incorrect password");
      return res.status(401).json({
        errorMessage: "Wrong password provided.",
      });
    }

    const token = auth.signToken(user.id);
    console.log(token);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: true,
      })
      .status(200)
      .json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

exports.logout = (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    })
    .send();
};

exports.register = async (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password || !req.body.confirmPassword) {
    return res.status(400).json({
      errorMessage: "Fields must not be empty",
    });
  }

  if (!req.body.email.includes("@") || !req.body.email.includes(".")) {
    return res.status(404).json({
      errorMessage: "Invalid email",
    });
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(402).json({
      errorMessage: "Passwords don't match",
    });
  }

  bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
    if (err) {
      return res.status(500).json({
        errorMessage: "Failed to hash password",
      });
    }

    try {
      const user = await User.create({
        email: req.body.email,
        username: req.body.username,
        password: hash,
      });
      const token = auth.signToken(user.id);
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .json(user)
        .send();

      return res.status(200).json(user);
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return res.status(403).json({
          errorMessage: "Username already exists",
        });
      }
    }
  });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json(user);
};

exports.changePassword = async(req, res) => {
  if (!req.body.email || !req.body.otp || !req.body.password || !req.body.confirmPassword) {
    return res.status(401).json({
      errorMessage: "Fields must not be empty",
    });
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(403).json({
      errorMessage: "Passwords don't match",
    });
  }

  //remove expired keys
  await RecoveryPassword.destroy({
    where: {
      expires_at: {[Op.lt]: new Date()}
    }
  });

  // finding user with email
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return res.status(402).json({
      errorMessage: "Email not found",
    });
  }

  //finding recovery token
  const recovery = await RecoveryPassword.findOne({ where: { email: req.body.email } });
  if (!recovery) {
    return res.status(402).json({
      errorMessage: "OTP not requested or Expired",
    });
  }

  //compare otp
  const otpCorrect = await bcrypt.compare(req.body.otp, recovery.password);
  if (!otpCorrect) {
    return res.status(402).json({
      errorMessage: "Wrong OTP.",
    });
  }

  //delete recovery token
  await recovery.destroy();

  //hash password and update
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
  user.password = hashedPassword;
  await user.save();
  
  //return 200
  return res.status(200);
};

exports.deleteUser = () => {
  // TODO
};

 exports.sendRecoveryEmail = async(req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return res.status(400).json({
      errorMessage: "Email not found",
    });
  }

  // create transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: config.HOST,
    port: config.PORT,
    secure: config.SECURE,
    auth: {
      user: config.USER,
      pass: config.PASS,
    },
  });

  //generate random key
  const key = crypto.randomBytes(12).toString('hex')

  const bodyText = 'A request was made through Mapology to reset your password. \n\n Your OTP/One Time Password is:  ' + key + '\n\n If you did not request this password reset please ignore this email.'   

  //remove existing recovery passwords
  await RecoveryPassword.destroy({
    where: {
      email: req.body.email
    }
  });

  const token = await bcrypt.hash(key, saltRounds)

  //insert random key as recovery password
  await RecoveryPassword.create({
    email: req.body.email,
    password: token,
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: '"Mapology 416" <Mapology416@outlook.com>', // sender address
    to: req.body.email, // list of receivers
    subject: "IMPORTANT: Reset your Mapology password", // Subject line
    text: bodyText, // plain text body
  });
}