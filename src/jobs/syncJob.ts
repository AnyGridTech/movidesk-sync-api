import { PgBoss } from "pg-boss";
import { syncTickets } from "../controllers/Tickets.js";

const boss = new PgBoss(process.env.DATABASE_URL!);

export async function startJobs() {
  await boss.start();
  console.log("PgBoss iniciado!");

  await boss.createQueue("sync-tickets");

  await boss.work("sync-tickets", async () => {
    console.log(`[${new Date().toISOString()}] Iniciando sync...`);
    try {
      const total = await syncTickets();
      console.log(
        `[${new Date().toISOString()}] Sync concluído! Total: ${total}`,
      );
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Sync falhou:`, err);
      throw err;
    }
  });

  await boss.schedule("sync-tickets", "*/10 * * * *");
  console.log("Job agendado, rodando a cada 10 minutos!");
}
