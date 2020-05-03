const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		pageTitle: 'Login',
		path: '/login',
		oldInput: {
			username: '',
    },
    errorMessage:''
	});
};

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		pageTitle: 'Signup',
		path: '/signup',
		errorMessage: '',
		page: 'Signup',
		oldInput: {
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationErrors: [],
	});
};

exports.postLogin = (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	User.findOne({ where: { username: username } }).then((user) => {
		if (!user) {
			return res.status(422).render('auth/login', {
				pageTitle: 'Login',
				path: '/login',
				oldInput: {
					username: username,
        },
        errorMessage: 'Invalid username or password!'
			});
    }
    bcrypt.compare(password, user.password)
    .then(result => {
      if(result) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(err => {
          console.log(err);
          res.redirect('/admin/pages/panel?loc=home');
        });
      }
      return res.status(422).render('auth/login', {
				pageTitle: 'Login',
				path: '/login',
				oldInput: {
					username: username,
        },
        errorMessage: 'Invalid username or password!'
			});
    })
    .catch(err => console.log(err));
	});
};

exports.postSignup = (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;

	const errors = validationResult(req);
	console.log(errors.array());
	if (!errors.isEmpty()) {
		return res.status(422).render('auth/signup', {
			path: '/signup',
			pageTitle: 'Signup',
			errorMessage: errors.array()[0].msg,
			oldInput: {
				username: username,
				email: email,
			},
			validationErrors: errors.array(),
		});
	}
	bcrypt
		.hash(password, 12)
		.then((hashedPassword) => {
			return User.create({
				username: username,
				email: email,
				password: hashedPassword,
			});
		})
		.then(() => {
			res.redirect('/login');
		})
		.catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/login');
  });
};