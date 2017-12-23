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

    app.get("/api/cards/:subjectId", (req, res) => {
      logger.info("Getting cards");
      this.service.getCards().then(cards => res.json(cards));
    });
  }
}

export default new CardApi();
