const bcrypt = require("bcrypt");
const saltRounds = 10;
const { User } = require("../sequelize/sequelize");

exports.loggedIn = () => {
	

};

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
		res.status(200).json(user)
	}
	catch (err) {
        console.error(err);
        res.status(500).send();
    }
};

exports.logout = () => {
// TODO
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
	const salt = await bcrypt.genSalt(saltRounds);
	const hash = await bcrypt.hash(req.body.password, salt);
	const user = await User.create({
		email: req.body.email,
		username: req.body.username,
		password: hash,
	});
	
	return res.status(200).json(user);
	
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
