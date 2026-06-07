import "dotenv/config"
import { api } from "./src/api/MovideskAPI.js";

async function test() {
  const response = await api.get("/tickets", {
    params: {
      token: process.env.MOVIDESK_TOKEN,
      $select: "id,status,createdDate,customFieldValues",
      $expand: "customFieldValues($expand=items)",
      $orderby: "id asc",
      $top: 1,
      $skip: 4000,
    },
  });

  console.log(JSON.stringify(response.data, null, 2));
}

test()