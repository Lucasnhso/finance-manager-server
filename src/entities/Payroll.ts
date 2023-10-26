export interface Payroll {
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
