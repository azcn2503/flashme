const initialise = ({ app, logger }) => {
  logger.info('get routes initialised');

  app.use('/test', (req, res) => {
    logger.info('test');
    res.send(200);
  });
};

export default initialise;
