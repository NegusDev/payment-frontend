import { Suspense, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Transactions as T } from "@/types/transaction";
import { checkTransactionStatus } from "@/api/transaction-api"; // Assuming you might want to fetch here
import { TableSkeleton } from "./skeleton/table-skeleton";
import { DataTable } from "./data-table/data-table";
import { TransactionColumns } from "./data-table/column";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

interface TransactionsProps {
  transactions: T[];
}

export default function Transactions({ transactions }: TransactionsProps) {
  const [loading, setLoading] = useState<boolean>(!transactions || transactions.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState<T | null>(null);


  const openModal = async (referenceNumber: string) => {
    // setLoading(true);
    setError(null);
    try {
      const { status, data } = await checkTransactionStatus(referenceNumber);
      if (status !== 200) {
        throw new Error(`Failed to fetch transaction status for ${referenceNumber}`);
      }
      setOpen(true);
      setModalContent(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching transaction status");
    } finally {
      // setLoading(false);
    }
  };

    console.log(setLoading);


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Transactions</CardTitle>
          <CardDescription>
            Recent transactions will be displayed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton rows={10} columns={4} />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <Suspense fallback={<TableSkeleton rows={6} columns={4} />}>
                <DataTable columns={TransactionColumns(openModal)} data={transactions} />
              </Suspense>
              <AlertDialog
                open={open}
                onOpenChange={(isOpen) => {
                  setOpen(isOpen);
                  if (!isOpen) {
                    setModalContent(null);
                  }
                }}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Transaction Status</AlertDialogTitle>
                    <AlertDialogDescription>
                      <div className="flex flex-col gap-2">
                        The transaction with reference number{" "}
                        {modalContent?.reference_number} is currently marked as{" "}
                        {modalContent?.status}
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex justify-center">
                    <AlertDialogCancel className="w-full">OK</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}