import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/mode-toggle'
import { PaymentForm } from "@/components/payment-form"
import Transactions from '@/components/transactions'
import { useEffect, useState } from 'react';
import { Transactions as T } from '@/types/transaction';
import { getTransactions } from '@/api/transaction-api';


function Home() {
  const [transactions, setTransactions] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const getTransactionData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { status, data } = await getTransactions();
        if (status !== 200) {
          throw new Error(`Error: "Failed to fetch transactions"}`);
        }
        setTransactions(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    getTransactionData();
  }, [])



  const handleNewTransaction = (newTransaction: T) => {
    console.log(loading, error);
    setTransactions([newTransaction, ...transactions]);
    // getTransactionData();
  };


  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme' >
      <ModeToggle />
      <div className="flex min-h-svh w-full items-stretch justify-center p-6 md:p-10">
        <div className="flex w-full max-w-7xl">
          <div className="w-full md:w-4/12 pr-4 flex-grow">
            <PaymentForm onTransactionSubmit={handleNewTransaction} />
          </div>
          <div className="w-full md:w-8/12 flex-grow">
            <Transactions transactions={transactions} />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default Home
