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
      .catch(err => res.sendStatus(500));
  });

  app.post("/api/test/:subjectId/retest/:testId", loggedIn, (req, res) => {
    const { subjectId, testId } = req.params;
    logger.info(`Adding retest of ${testId} to subject ${subjectId}`);
    return testService
      .addRetest(req.user.id, subjectId, testId)
      .then(test => res.json(test))
      .catch(err => res.sendStatus(500));
  });

  app.delete("/api/test/:testId", loggedIn, (req, res) => {
    const { testId } = req.params;
    logger.info(`Removing test ${testId}`);
    return testService
      .removeTest(req.user.id, testId)
      .then(() => res.sendStatus(200))
      .catch(err => res.sendStatus(500));
  });

  app.put("/api/test/:testId/start", loggedIn, (req, res) => {
    const { testId } = req.params;
    logger.info(`Starting test ${testId}`);
    return testService
      .startTest(req.user.id, testId)
      .then(() => res.sendStatus(200))
      .catch(err => res.sendStatus(500));
  });

  app.put("/api/test/:testId/complete", loggedIn, (req, res) => {
    const { testId } = req.params;
    logger.info(`Completing test ${testId}`);
    return testService
      .completeTest(req.user.id, testId)
      .then(() => res.sendStatus(200))
      .catch(err => res.sendStatus(500));
  });

  app.put("/api/test/:testId/abandon", loggedIn, (req, res) => {
    const { testId } = req.params;
    logger.info(`Abandoning test ${testId}`);
    return testService
      .abandonTest(req.user.id, testId)
      .then(() => res.sendStatus(200))
      .catch(err => res.sendStatus(500));
  });

  app.put("/api/test/:testId/answer", loggedIn, (req, res) => {
    const { testId } = req.params;
    const { cardIndex, correct } = req.body;
    return testService
      .answerTestCard(req.user.id, testId, cardIndex, correct)
      .then(test => res.status(200).json(test))
      .catch(err => res.sendStatus(500));
  });

  logger.debug("Tests API initialised");
};

export default testApi;
