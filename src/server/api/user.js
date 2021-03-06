const userApi = ({ app, logger, userService, passport, loggedIn }) => {
  app.post("/api/user/login", (req, res, next) => {
    return passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      } else if (!user) {
        return res.sendStatus(404);
      } else {
        return req.logIn(user, err => {
          if (err) {
            return next(err);
          } else {
            return res.json(user);
          }
        });
      }
    })(req, res, next);
  });

  app.post("/api/user/register", (req, res) => {
    const { username, password, email } = req.body;
    return userService
      .registerUser(username, password, email)
      .then(user => res.json(user))
      .catch(err => {
        return res.status(err.status).json(err.message);
      });
  });

  app.get("/api/user/logout", loggedIn, (req, res) => {
    try {
      req.logout();
      req.session.destroy();
      return res.sendStatus(200);
    } catch (ex) {
      return res.sendStatus(500);
    }
  });

  app.get("/api/user", loggedIn, (req, res) => {
    return userService
      .findUserById(req.user.id)
      .then(user => res.json(user))
      .catch(() => res.sendStatus(404));
  });

  logger.debug("User API initialised");
};

export default userApi;
