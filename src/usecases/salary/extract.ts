import { prismaClient } from "../../database";
import { findPayroll } from "../../integrations/senior/findPayroll";

interface Payroll {
  id: string;
  graphic: {
    name: string;
    data: number[];
  }[];
  calculation: {
    paymentReference: string;
    paymentDate: string;
    reportLink: string;
    type: string;
  };
  currency: string;
  referenceSalary: number;
  netValue: number;
}

interface Salary {
  externalId: string;
  paymentReference: string;
  paymentDate: Date;
  reportLink: string;
  currency: string;
  referenceSalary: number;
  receivedValue: number;
  advanceValue: number;
  discounts: {
    name: string;
    value: number;
  }[];
  type: string;
}

export async function extractSalary() {
  console.log("Starting extract salary");

  const payroll: Payroll[] = await findPayroll();

  const salaryRes: Salary[] = payroll.map((item) => {
    const advanceValue = item.graphic.find(
      (e: { name: string }) => e.name === "Desc.Adto Salarial"
    );

    const discounts = item.graphic
      .filter(
        (e: { name: string; data: number[] }) =>
          e.name !== "Desc.Adto Salarial" && e.data[0] < 0
      )
      .map((e: { name: any; data: any[] }) => {
        return {
          name: e.name,
          value: e.data[0],
        };
      });
    return {
      externalId: item.id,
      paymentReference: item.calculation.paymentReference,
      paymentDate: new Date(item.calculation.paymentDate),
      reportLink: item.calculation.reportLink,
      currency: item.currency,
      referenceSalary: item.referenceSalary,
      receivedValue: item.netValue,
      advanceValue: advanceValue ? advanceValue.data[0] * -1 : 0,
      discounts,
      type: item.calculation.type,
    };
  });

  const bdSalaries = await prismaClient.salary.findMany({
    where: {
      externalId: {
        in: salaryRes.map((e) => e.externalId),
      },
    },
  });

  const newSalaries = salaryRes.filter(
    (salary) => !bdSalaries.find((e) => e.externalId === salary.externalId)
  );

  await prismaClient.salary.createMany({ data: newSalaries });

  console.log("Ended extract salary");
}
