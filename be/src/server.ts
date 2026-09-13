import { app } from "./app";
import { PORT, HOST } from "./helper/constants";
import startUp from "./startup";

app.listen(Number(PORT), HOST!, async () => {
  await startUp();
  console.log(`http://${HOST}:${PORT} is up and running 🚀`);
});
