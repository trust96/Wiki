import { app } from "./app";
import { PORT, HOST } from "./helper/constants";
import startUp from "./startup";
import { connectRedis } from "./middleware/sessionMiddleware";

const start = async () => {
  await connectRedis();
  await startUp();

  app.listen(Number(PORT), HOST!, () => {
    console.log(`http://${HOST}:${PORT} is up and running 🚀`);
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
