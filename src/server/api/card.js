const cardApi = ({ app, logger, cardService }) => {
  app.get("/api/subject/:subjectId/cards", (req, res) => {
    const { subjectId } = req.params;
    logger.info(`Getting cards for subject ${subjectId}`);
    return cardService.getCards(subjectId).then(cards => res.json(cards));
  });

  app.post("/api/card", (req, res) => {
    logger.info("Adding card");
    return cardService
      .addCard(req.body.card, req.body.subjectId)
      .then(card => res.json(card));
  });

  app.put("/api/card/:cardId", (req, res) => {
    logger.info(`Updating card ${req.params.cardId}`);
    return cardService
      .updateCard(req.params.cardId, req.body.card)
      .then(card => res.json(card));
  });

  app.delete("/api/card/:cardId", (req, res) => {
    logger.info(`Removing card ${req.params.cardId}`);
    return cardService
      .removeCard(req.params.cardId)
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  });

  logger.debug("Cards API initialised");
};

export default cardApi;
