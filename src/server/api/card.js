const cardApi = ({ app, logger, cardService, loggedIn }) => {
  app.get("/api/subject/:subjectId/cards", loggedIn, (req, res) => {
    const { subjectId } = req.params;
    logger.info(`Getting cards for subject ${subjectId}`);
    return cardService
      .getCards(req.user.id, subjectId)
      .then(cards => res.json(cards))
      .catch(err => res.status(500).json(err));
  });

  app.post("/api/card", loggedIn, (req, res) => {
    logger.info("Adding card");
    return cardService
      .addCard(req.user.id, req.body.card, req.body.subjectId)
      .then(card => res.json(card))
      .catch(err => res.status(500).json(err));
  });

  app.put("/api/card/:cardId", loggedIn, (req, res) => {
    logger.info(`Updating card ${req.params.cardId}`);
    return cardService
      .updateCard(req.user.id, req.params.cardId, req.body.card)
      .then(card => res.json(card))
      .catch(err => res.status(500).json(err));
  });

  app.delete("/api/card/:cardId", loggedIn, (req, res) => {
    logger.info(`Removing card ${req.params.cardId}`);
    return cardService
      .removeCard(req.user.id, req.params.cardId)
      .then(() => res.sendStatus(200))
      .catch(err => res.status(500).json(err));
  });

  logger.debug("Cards API initialised");
};

export default cardApi;
