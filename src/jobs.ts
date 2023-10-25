import schedule from "node-schedule";
import { extractSalary } from "./usecases/salary/extract";

schedule.scheduleJob("0 6 * * *", async () => {
  await extractSalary();
});
