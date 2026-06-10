import { PgBoss } from "pg-boss";
import { syncTickets } from "../controllers/sync-tickets.controller.js";

const boss = new PgBoss(process.env.DATABASE_URL!);

export async function startJobs() {
  await boss.start();

  await boss.createQueue("sync-tickets");
  await boss.work("sync-tickets", async () => {
    try {
      await syncTickets();
    } catch (err) {
      throw err;
    }
  });

  await boss.schedule("sync-tickets", "*/60 * * * *");
}
