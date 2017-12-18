const initialise = ({ app, logger }) => {
  app.use("/api/cards/:subjectId", (req, res) => {
    logger.info("Getting cards for subject " + req.params.subjectId);
    res.send(200);
  });

  app.use("/api/cards", (req, res) => {
    logger.info("Getting cards");
    res.send(200);
  });
};

export default initialise;
