import { PgBoss } from "pg-boss";
import { syncTickets } from "../controllers/Tickets.js";

const boss = new PgBoss(process.env.DATABASE_URL!);

export async function startJobs() {
  await boss.start();

  await boss.createQueue("sync-tickets");
console.log("iniciou")
  await boss.work("sync-tickets", async () => {
    try {
   const salve =   await syncTickets();
      console.log(salve)
    } catch (err) {
      throw err;
    }
  });

  await boss.schedule("sync-tickets", "*/30 * * * *");
}
