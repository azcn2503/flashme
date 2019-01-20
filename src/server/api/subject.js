const subjectApi = ({
  app,
  logger,
  subjectService,
  cardService,
  testService,
  loggedIn
}) => {
  app.get("/api/subjects", loggedIn, (req, res) => {
    logger.info("Getting all subjects");
    return subjectService
      .getSubjects(req.userId)
      .then(subjects => cardService.getCardCount(req.userId, subjects))
      .then(subjects => testService.getTestCount(req.userId, subjects))
      .then(subjects => res.json(subjects))
      .catch(err => res.sendStatus(500));
  });

  app.get("/api/subject/:subjectId", loggedIn, (req, res) => {
    logger.info(`Getting subject ${req.params.subjectId}`);
    return subjectService
      .getSubject(req.userId, req.params.subjectId)
      .then(subject => res.json(subject))
      .catch(err => res.sendStatus(500));
  });

  app.post("/api/subject", loggedIn, (req, res) => {
    logger.info("Adding subject");
    return subjectService
      .addSubject(req.userId)
      .then(subject => res.json(subject))
      .catch(err => res.sendStatus(500));
  });

  app.put("/api/subject/:subjectId/title", loggedIn, (req, res) => {
    logger.info(`Updating subject title for ${req.params.subjectId}`);
    return subjectService
      .updateSubjectTitle(req.userId, req.params.subjectId, req.body.title)
      .then(subject => res.json(subject))
      .catch(err => res.sendStatus(500));
  });

  app.delete("/api/subject/:subjectId", loggedIn, (req, res) => {
    const { subjectId } = req.params;
    logger.info(`Removing subject ${subjectId}`);
    return cardService
      .removeSubjectCards(req.userId, subjectId)
      .then(() => testService.removeSubjectTests(req.userId, subjectId))
      .then(() => subjectService.removeSubject(req.userId, subjectId))
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  });

  logger.debug("Subjects API initialised");
};

export default subjectApi;
