class CardApi {
  initialise({ app, logger, cardService }) {
    app.get("/api/subject/:subjectId/cards", (req, res) => {
      logger.info("Getting cards");
      cardService.getCards(req.params.subjectId).then(cards => res.json(cards));
    });

    app.post("/api/card", (req, res) => {
      logger.info("Adding card");
      cardService.addCard(req.body.card).then(card => res.json(card));
    });

    logger.debug("Cards API initialised");
  }
}

export default new CardApi();
