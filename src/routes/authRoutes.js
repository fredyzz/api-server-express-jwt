/* eslint-disable no-underscore-dangle */
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

let refreshTokens = [];
const router = express.Router();

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res) => {
    res.json({
      message: 'Signup successful',
      user: req.user,
    });
  },
);

router.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err, user) => {
        try {
          if (err || !user) {
            const error = new Error('An error occurred.');

            return next(error);
          }

          return req.login(
            user,
            { session: false },
            async (error) => {
              if (error) return next(error);

              const body = { _id: user._id, email: user.email };
              const token = jwt.sign(
                { user: body },
                process.env.SECRET_KEY,
                { expiresIn: process.env.TOKEN_REFRESH_TIME },
              );
              const refreshToken = jwt.sign(
                { user: body },
                process.env.SECRET_KEY,
              );

              refreshTokens.push(
                token,
                refreshToken,
              );

              return res.json({ token, refreshToken });
            },
          );
        } catch (error) {
          return res.status;
        }
      },
    )(req, res, next);
  },
);

router.post('/token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }

  return jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const data = { _id: user._id, email: user.email };

    const accessToken = jwt.sign(
      { user: data },
      process.env.SECRET_KEY,
      { expiresIn: process.env.TOKEN_REFRESH_TIME },
    );

    return res.json({
      accessToken,
    });
  });
});

router.post('/logout', (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((current) => current !== token);

  res.send('Logout successful');
});

module.exports = router;
