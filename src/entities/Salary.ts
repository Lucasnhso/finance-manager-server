export interface Salary {
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
