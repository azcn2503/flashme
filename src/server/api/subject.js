class SubjectApi {
  constructor() {
    this.app = null;
    this.logger = null;
    this.service = null;
  }

  initialise({ app, logger, service }) {
    this.app = app;
    this.logger = logger;
    this.service = service;

    this.app.get("/api/subjects", (req, res) => {
      this.logger.info("Getting all subjects");
      return this.service.getSubjects().then(subjects => res.json(subjects));
    });

    this.app.post("/api/subject", (req, res) => {
      this.logger.info("Adding subject");
      return this.service.addSubject().then(subject => res.json(subject));
    });

    this.app.put("/api/subject/:subjectId/title", (req, res) => {
      this.logger.info("Updating subject title for " + req.params.subjectId);
      return this.service
        .updateSubjectTitle(req.params.subjectId, req.body.title)
        .then(subject => res.json(subject));
    });
  }
}

export default new SubjectApi();
