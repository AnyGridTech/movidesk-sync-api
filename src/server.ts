import express from "express";
import { startJobs } from "./jobs/syncJob.js";
import router from "./routes/index.js";
import "dotenv/config";
import { errorHadling } from "./middlewares/errorHandling.js";

const app = express();

app.use(express.json());
app.use(router);
app.use(errorHadling);

async function bootstrap() {
  await startJobs();

  app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT ?? 3000}`);
  });
}

bootstrap().catch((error) => {
  console.error("Falha ao iniciar a aplicação:", error);
  process.exit(1);
});