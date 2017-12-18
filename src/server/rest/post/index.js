import uuidv4 from "uuid/v4";

const initialise = ({ app, logger }) => {
  app.use("/api/card/:subjectId", (req, res) => {
    logger.info("Adding card to subject " + req.params.subjectId);
    const card = {
      id: uuidv4(),
      created: Date.now(),
      subjectIds: [req.params.subjectId],
      ...req.body
    };
    res.json(card);
  });
};

export default initialise;
