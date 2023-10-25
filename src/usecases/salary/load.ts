import { prismaClient } from "../../database";

export async function loadSalary() {
  const data = await prismaClient.salary.findMany();
  const treatedData = data.map((item) => {
    const discounts = item.discounts as any[];
    const discountTotal = discounts.reduce(
      (acc: number, item: any) => acc + item.value,
      0
    );
    return {
      ...item,
      receivedValue: item.receivedValue + item.advanceValue,
      discountTotal,
      discounts: undefined,
    };
  });
  return treatedData;
}
