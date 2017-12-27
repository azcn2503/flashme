import authApi from "./auth";
import cardApi from "./card";
import subjectApi from "./subject";
import testApi from "./test";

export { authApi, cardApi, subjectApi, testApi };

// export const initialise = ({ app, logger }) => {

//   app.post("/api/card/:subjectId", (req, res) => {
//     logger.info("Adding card to subject " + req.params.subjectId);
//     cardService
//       .createCard(req.params.subjectId, req.body)
//       .then(card => res.json(card));
//   });

//   app.post("/api/test/:subjectId", (req, res) => {
//     logger.info("Adding test for " + req.params.subjectId);
//     testService
//       .createTest(req.params.subjectId, req.body.cards)
//       .then(test => res.json(test));
//   });
// };

// export default initialise;
