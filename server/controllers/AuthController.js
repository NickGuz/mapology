const auth = require('../auth')
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { User } = require("../sequelize/sequelize");



exports.loggedIn = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(400).json({
                loggedIn: false,
                user: userId,
            })
        }

        const loggedInUser = await User.findByPk(userId);
        console.log("loggedInUser: " + loggedInUser);

        return res.status(200).json({
            loggedIn: true,
            user: loggedInUser
        })
    } catch (err) {
        console.log("err: " + err);
        res.json(false);
    }
}

exports.login = async (req, res) => {
	console.log("login user");
	
	try {
		const userInfo = req.body.userInfo;
		const password = req.body.password;
		//check if password field is empty
		if (!userInfo || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
		// logging in with username
		const user = await User.findOne({where:{ username: userInfo}});
		
        if (!user) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email"
                })
        }
		
		const passwordCorrect = await bcrypt.compare(password, user.password);
        if (!passwordCorrect) {
            console.log("Incorrect password");
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong password provided."
                })
        }

		const token = auth.signToken(user.id);
		console.log(token);

		res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json(user)
	}
	catch (err) {
        console.error(err);
        res.status(500).send();
    }
};

exports.logout = (req, res) => {
	res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send();
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
		  res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: "none"
		}).send();
		  
	
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

exports.changePassword = () => {
// TODO
};

exports.deleteUser = () => {
// TODO
};
