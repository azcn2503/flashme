import * as cardService from "../service/card";
import * as subjectService from "../service/subject";
import * as testService from "../service/test";

export const initialise = ({ app, logger }) => {
  app.get("/api/cards/:subjectId", (req, res) => {
    logger.info("Getting cards for subject " + req.params.subjectId);
    res.send(200);
  });

  app.get("/api/cards", (req, res) => {
    logger.info("Getting cards");
    res.send(200);
  });

  app.post("/api/card/:subjectId", (req, res) => {
    logger.info("Adding card to subject " + req.params.subjectId);
    cardService
      .createCard(req.params.subjectId, req.body)
      .then(card => res.json(card));
  });

  app.post("/api/subject", (req, res) => {
    logger.info("Adding subject");
    subjectService.createSubject().then(subject => res.json(subject));
  });

  app.put("/api/subject/:subjectId/title", (req, res) => {
    logger.info("Updating subject title for " + req.params.subjectId);
    subjectService
      .updateSubjectTitle(req.params.subjectId, req.body.title)
      .then(subject => res.json(subject));
  });

  app.post("/api/test/:subjectId", (req, res) => {
    logger.info("Adding subject to " + req.params.subjectId);
    testService
      .createTest(subjectId, req.body.cards)
      .then(test => res.json(test));
  });
};

export default initialise;
