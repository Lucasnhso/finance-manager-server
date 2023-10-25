import { prismaClient } from "../../database";

export async function loadSalary() {
  const data = await prismaClient.salary.findMany();

  return data;
}
