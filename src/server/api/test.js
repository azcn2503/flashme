const testApi = ({ app, logger, testService, cardService, loggedIn }) => {
  app.get("/api/test/:testId", loggedIn, (req, res) => {
    const { testId } = req.params;
    logger.info(`Getting test ${testId}`);
    return testService
      .getTest(req.user.id, testId)
      .then(test => res.json(test));
  });

  app.get("/api/tests/subject/:subjectId", loggedIn, (req, res) => {
    const { subjectId } = req.params;
    logger.info(`Getting tests for subject ${subjectId}`);
    return testService
      .getTestsForSubject(req.user.id, subjectId)
      .then(tests => res.json(tests));
  });

  app.post("/api/test/:subjectId", loggedIn, (req, res) => {
    const { subjectId } = req.params;
    logger.info(`Adding test to subject ${subjectId}`);
    return cardService
      .getCards(req.user.id, subjectId)
      .then(cards => testService.addTest(req.user.id, subjectId, cards))
      .then(test => res.json(test))
      .catch(err => res.json(err).sendStatus(500));
  });

  app.delete("/api/test/:testId", loggedIn, (req, res) => {
    const { testId } = req.params;
    logger.info(`Removing test ${testId}`);
    return testService
      .removeTest(req.user.id, testId)
      .then(() => res.sendStatus(200))
      .catch(err => res.json(err).sendStatus(500));
  });

  logger.debug("Tests API initialised");
};

export default testApi;
