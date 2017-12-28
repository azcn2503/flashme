const testApi = ({ app, logger, testService, cardService }) => {
  app.get("/api/test/:testId", (req, res) => {
    const { testId } = req.params;
    return testService.getTest(testId).then(test => res.json(test));
  });

  app.get("/api/tests/subject/:subjectId", (req, res) => {
    const { subjectId } = req.params;
    return testService
      .getTestsForSubject(subjectId)
      .then(tests => res.json(tests));
  });

  app.post("/api/test/:subjectId", (req, res) => {
    const { subjectId } = req.params;
    return cardService
      .getCards(subjectId)
      .then(cards => testService.addTest(subjectId, cards))
      .then(test => res.json(test))
      .catch(err => res.json(err).sendStatus(500));
  });

  logger.debug("Tests API initialised");
};

export default testApi;
