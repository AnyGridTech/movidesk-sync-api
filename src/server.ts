import express from "express";
import { startJobs } from "./jobs/syncJob.js";
import router from "./routes/index.js";
import "dotenv/config";
import { errorHadling } from "./middlewares/errorHandling.js";
const app = express();

app.use(express.json());
app.use(router);
app.use(errorHadling)

app.listen(process.env.PORT ?? 3000, async () => {
  await startJobs();
});
