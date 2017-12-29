const testApi = ({ app, logger, testService, cardService }) => {
  app.get("/api/test/:testId", (req, res) => {
    const { testId } = req.params;
    logger.info(`Getting test ${testId}`);
    return testService
      .getTest(req.user.id, testId)
      .then(test => res.json(test));
  });

  app.get("/api/tests/subject/:subjectId", (req, res) => {
    const { subjectId } = req.params;
    logger.info(`Getting tests for subject ${subjectId}`);
    return testService
      .getTestsForSubject(req.user.id, subjectId)
      .then(tests => res.json(tests));
  });

  app.post("/api/test/:subjectId", (req, res) => {
    const { subjectId } = req.params;
    logger.info(`Adding test to subject ${subjectId}`);
    return cardService
      .getCards(req.user.id, subjectId)
      .then(cards => testService.addTest(req.user.id, subjectId, cards))
      .then(test => res.json(test))
      .catch(err => res.json(err).sendStatus(500));
  });

  logger.debug("Tests API initialised");
};

export default testApi;
