const Boom = require('boom');
const User = require('../models/user');
const Joi = require('joi');

const Accounts = {
  index: {
    auth: false,
    handler: function(request, h) {
      return h.view('main', { title: 'Welcome to Donations' });
    }
  },
  showSignup: {
    auth: false,
    handler: function(request, h) {
      return h.view('signup', { title: 'Sign up for Donations' });
    }
  },

  signup: {
    auth: false,
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required()
      },
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        return h
          .view('signup', {
            title: 'Sign up error',
            errors: error.details
          })
          .takeover()
          .code(400);
      }
    },
    handler: async function(request, h) {
      try {
        const payload = request.payload;
        let user = await User.findByEmail(payload.email);
        if (user) {
          const message = 'Email address is already registered';
          throw new Boom(message);
        }
        if (payload.password === 'supersecretadminpassword') {
          const newUser = new User({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            password: payload.password,
            admin: true
          });
          user = await newUser.save(); //when newUser is saved to mongoDB, an id is created, Mongo requires unique ids so
          request.cookieAuth.set({ id: user.id }); //... does this automatically
          return h.redirect('/adminhome');
        }
        if (payload.password != 'supersecretadminpassword') {
          const newUser = new User({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            password: payload.password,
            admin: false
          });
          user = await newUser.save(); //when newUser is saved to mongoDB, an id is created, Mongo requires unique ids so
          request.cookieAuth.set({ id: user.id }); //... does this automatically
          return h.redirect('/home');
        }
      } catch (err) {
        return h.view('signup', { errors: [{ message: err.message }] });
      }
    }
  },


  showLogin: {
    auth: false,
    handler: function(request, h) {
      return h.view('login', { title: 'Login to Donations' });
    }
  },
  login: {
    auth: false,
    handler: async function(request, h) {
      const { email, password, admin } = request.payload;
      try {
        let user = await User.findByEmail(email);
        if (!user) {
          const message = 'Email address is not registered';
          throw new Boom(message);
        }
        if (user.admin === false) {
          user.comparePassword(password);
          request.cookieAuth.set({ id: user.id }); //this id will be requested by many handlers (const id = request.auth.credentials.id;)
          return h.redirect('/listlocations');
        }
        if (user.admin === true) {
          user.comparePassword(password);
          request.cookieAuth.set({ id: user.id }); //this id will be requested by many handlers (const id = request.auth.credentials.id;)
          return h.redirect('/adminhome');
        }
      } catch (err) {
        return h.view('login', { errors: [{ message: err.message }] });
      }
    }
  },
  showUserSettings: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        return h.view('showusersettings', { title: 'User Info', user: user });
      } catch (err) {
        return h.view('login', { errors: [{ message: err.message }] });
      }
    }
  },
  updateUserSettings: {
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required()
      },
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        return h
          .view('settings', {
            title: 'Sign up error',
            errors: error.details
          })
          .takeover()
          .code(400);
      }
    }, // here ends the joi error handling. assuming no errors, the handler does its thing
    handler: async function(request, h) {
      try {
        const userEdit = request.payload;
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        user.firstName = userEdit.firstName;
        user.lastName = userEdit.lastName;
        user.email = userEdit.email;
        user.password = userEdit.password;
        await user.save();
        return h.redirect('/settings');
      } catch (err) {
        return h.view('main', { errors: [{ message: err.message }] });
      }
    }
  },
  logout: {
    handler: function(request, h) {
      request.cookieAuth.clear();
      return h.redirect('/');
    }
  }
};

module.exports = Accounts;
