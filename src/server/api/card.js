class CardApi {
  constructor() {
    this.app = null;
    this.logger = null;
    this.service = null;
  }

  initialise({ app, logger, service }) {
    this.app = app;
    this.logger = logger;
    this.service = service;

    app.get("/api/subject/:subjectId/cards", (req, res) => {
      logger.info("Getting cards");
      this.service
        .getCards(req.params.subjectId)
        .then(cards => res.json(cards));
    });

    app.post("/api/card", (req, res) => {
      logger.info("Adding card");
      this.service.addCard(req.body.card).then(card => res.json(card));
    });

    this.logger.debug("Cards API initialised");
  }
}

export default new CardApi();
