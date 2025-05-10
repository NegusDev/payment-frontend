export type Transactions = {
  id: number;
  reference_number: string;
  payer: number;
  payee: number;
  amount: string;
  currency: string;
  status: string;
  notes?: string;
  created_at?: string;
}

export interface TransactionResponse {
  status?: number,
  message: string,
  transactionReference?: string,
  data: Transactions,
};