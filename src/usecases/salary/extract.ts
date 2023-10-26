import dayjs from "dayjs";
import { prismaClient } from "../../database";
import { sendMail } from "../../helpers/sendMail";
import { findPayroll } from "../../integrations/senior/findPayroll";
import { formatCurrency } from "../../utils/formatCurrency";

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

  if (newSalaries.length) {
    await prismaClient.salary.createMany({ data: newSalaries });
    await sendMail({
      to: "lucasnhso@gmail.com",
      subject: `Salario recebido`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Relatório de Salários</title>
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; width: 80%; margin: auto;">
            <h2>Salários Recebidos</h2>
            ${newSalaries.map(
              (e) => `
              <div style="background: #fff; padding: 20px; margin: 20px 0; border-radius: 5px;">
                <p style="font-weight: bold; white-space: nowrap;">Data do Pagamento: ${dayjs(
                  e.paymentDate
                ).format("DD/MM/YYYY")}</p>
                <p>Valor Bruto: ${formatCurrency(e.referenceSalary)}</p>
                <p>Valor Recebido: ${formatCurrency(e.receivedValue)}</p>
                <p>Valor Adiantamento: ${formatCurrency(e.advanceValue)}</p>
                <p>Mês Referente: ${dayjs(e.paymentReference).format(
                  "MMMM YYYY"
                )}</p>
              </div>
            `
            )}
          </div>
        </body>
        </html>
      `,
    });
  }

  console.log("Ended extract salary");
}
