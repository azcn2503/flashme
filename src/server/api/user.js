const userApi = ({ app, logger, userService, passport }) => {
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
      .then(user => res.json(user));
  });

  logger.debug("User API initialised");
};

export default userApi;
