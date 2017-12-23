class SubjectApi {
  initialise({ app, logger, subjectService, cardService }) {
    app.get("/api/subjects", (req, res) => {
      logger.info("Getting all subjects");
      return subjectService
        .getSubjects()
        .then(subjects => cardService.getCardCount(subjects))
        .then(subjects => res.json(subjects));
    });

    app.get("/api/subject/:subjectId", (req, res) => {
      logger.info("Getting subject " + req.params.subjectId);
      return subjectService
        .getSubject(req.params.subjectId)
        .then(subject => res.json(subject));
    });

    app.post("/api/subject", (req, res) => {
      logger.info("Adding subject");
      return subjectService.addSubject().then(subject => res.json(subject));
    });

    app.put("/api/subject/:subjectId/title", (req, res) => {
      logger.info("Updating subject title for " + req.params.subjectId);
      return subjectService
        .updateSubjectTitle(req.params.subjectId, req.body.title)
        .then(subject => res.json(subject));
    });

    logger.debug("Subjects API initialised");
  }
}

export default new SubjectApi();
