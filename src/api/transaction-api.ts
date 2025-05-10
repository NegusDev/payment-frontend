import { TransactionResponse } from "@/types/transaction"
import axiosClient from "@/utils/axios"
import config from "@/utils/config"



export async function initiatePayment(data: object): Promise<TransactionResponse | null> {
  let response = null
  await axiosClient({
    url: `${config.backendURL}/initiate-transaction`,
    headers: {
      Accept: 'application/json'
    },
    method: 'POST',
    data: data
  })
    .then(async (res) => {
      response = res.data
    })
    .catch((e) => {
      response = e.response.data
    })
  return response
}

export async function getTransactions() {
  try {
    const response = await axiosClient.get(`/transactions`, {
      headers: {
        Accept: 'application/json',
      }
    })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error?.response
  }
}

export async function checkTransactionStatus(referenceNumber: string) {
  try {
    const response = await axiosClient.get(`/check-status/${referenceNumber}`, {
      headers: {
        Accept: 'application/json',
      }
    })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error?.response
  }
}