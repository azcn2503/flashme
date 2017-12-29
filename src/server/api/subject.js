const subjectApi = ({ app, logger, subjectService, cardService }) => {
  app.get("/api/subjects", (req, res) => {
    logger.info("Getting all subjects");
    return subjectService
      .getSubjects(req.user.id)
      .then(subjects => cardService.getCardCount(req.user.id, subjects))
      .then(subjects => res.json(subjects));
  });

  app.get("/api/subject/:subjectId", (req, res) => {
    logger.info(`Getting subject ${req.params.subjectId}`);
    return subjectService
      .getSubject(req.user.id, req.params.subjectId)
      .then(subject => res.json(subject));
  });

  app.post("/api/subject", (req, res) => {
    logger.info("Adding subject");
    return subjectService
      .addSubject(req.user.id)
      .then(subject => res.json(subject));
  });

  app.put("/api/subject/:subjectId/title", (req, res) => {
    logger.info(`Updating subject title for ${req.params.subjectId}`);
    return subjectService
      .updateSubjectTitle(req.user.id, req.params.subjectId, req.body.title)
      .then(subject => res.json(subject));
  });

  app.delete("/api/subject/:subjectId", (req, res) => {
    const { subjectId } = req.params;
    logger.info(`Removing subject ${subjectId}`);
    return cardService
      .removeSubjectCards(req.user.id, subjectId)
      .then(() => subjectService.removeSubject(req.user.id, subjectId))
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  });

  logger.debug("Subjects API initialised");
};

export default subjectApi;
