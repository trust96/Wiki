import morgan from "morgan";
import logger from "../helper/logger";

const morganMiddleware = morgan(":method :status :res[content-length] - :response-time ms", {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

export default morganMiddleware;
