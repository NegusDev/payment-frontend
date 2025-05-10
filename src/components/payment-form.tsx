import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { currencyCodes } from "@/utils/currency"
import { Currency } from "@/types/currency"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { AlertCircle, Loader } from "lucide-react"
import { Alert, AlertDescription } from "./ui/alert"
import { initiatePayment } from "@/api/transaction-api"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { TransactionResponse, Transactions } from "@/types/transaction"

interface PaymentFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onTransactionSubmit: (transaction: Transactions) => void;
}

export function PaymentForm({ 
  onTransactionSubmit,
  className,
  ...props
}: PaymentFormProps) {
  const [transaction, setTransaction] = useState({
    payer: "",
    payee: "",
    amount: "",
    currency: "UGX",
    notes: "",
  });
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<string>();
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState<TransactionResponse | null>(null);
  const [errors, setErrors] = useState<TransactionResponse | null>();

  useEffect(() => {
    setCurrencies(currencyCodes)
  })


  const handleSelectChange = (value: string) => {
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      currency: value,
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setTransaction({ ...transaction, [e.target.name]: value });
  }

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      notes: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    setErrors(null);
    setSuccess("");

    try {
      const response = await initiatePayment(transaction);
      if (typeof response?.message === 'string' && response?.message?.includes("Processing")) {
        setErrors(null);
        setModalContent(response);
        setOpen(true);
        setSuccess(response?.message)
        onTransactionSubmit(response.data);
        setTransaction({
          payer: "",
          payee: "",
          amount: "",
          currency: "UGX",
          notes: "",
        });
      } else {
        setSuccess("");
        setErrors(response);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false)
    }

  }

  // const openModal = (response: TransactionResponse) => {
  //   setModalContent(response);
  //   setOpen(true);
  // };

  setTimeout(() => {
    setSuccess('');
  }, 5000);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card >
        <CardHeader>
          <CardTitle className="text-2xl">Payment</CardTitle>
          <CardDescription>
            Enter the necessary details to complete your payment.
          </CardDescription>
          {errors?.message && <Alert className="bg-red-500" variant="destructive">
            <AlertCircle className="h-4 w-4 mb-3" />
            <AlertDescription>
              {typeof errors.message === 'string' ? (
                errors?.message
              ) : (
                Object.entries(errors.message).map(([field, messages]) => (
                  <div key={field}>
                    <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(', ') : String(messages)}
                  </div>
                ))
              )}
            </AlertDescription>
          </Alert>}
          {success && <Alert className="bg-green-500" variant="destructive">
            <AlertCircle className="h-4 w-4 mb-3" />
            <AlertDescription>
              {success}
            </AlertDescription>
          </Alert>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="sender">Sender Account</Label>
                <Input
                  id="sender"
                  type="number"
                  name="payer"
                  placeholder="1234567890"
                  required
                  autoComplete="OFF"
                  onChange={(e) => handleChange(e)}
                  value={transaction.payer}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="receiver">Receiver Account</Label>
                <Input
                  id="receiver"
                  type="number"
                  name="payee"
                  placeholder="1234567890"
                  required
                  autoComplete="OFF"
                  onChange={(e) => handleChange(e)}
                  value={transaction.payee}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  required
                  autoComplete="OFF"
                  onChange={(e) => handleChange(e)}
                  value={transaction.amount}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Currency</Label>
                <Select required={true} name="currency" onValueChange={handleSelectChange} value={transaction.currency.toString()}>
                  <SelectTrigger className="w-[100%]">
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.description}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  name="name"
                  placeholder=""
                  id="notes"
                  onChange={(e) => handleTextAreaChange(e)}
                  value={transaction.notes}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader /> : "Send"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <AlertDialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setModalContent(null);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Transaction Details</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex flex-col gap-2">
                <p>Ref No: {modalContent?.transactionReference}</p>
                <p>Details: {modalContent?.message}</p>
                <p>Current Status: PENDING</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center">
            <AlertDialogCancel className="w-full">OK</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
