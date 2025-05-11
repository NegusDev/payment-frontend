import config from "@/utils/config";
import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default async function getCsrfToken() {
  try {
    const sanctumBaseUrl = new URL(config.backendURL).origin;
    const response = await axios.get(`${sanctumBaseUrl}/sanctum/csrf-cookie`, {
      withCredentials: true, // Required to receive the XSRF-TOKEN cookie
      headers: {
        Accept: 'application/json', // Ensure Sanctum responds correctly
      },
    });
    // Sanctum returns 204 No Content on success
    if (response.status !== 204) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
    return true; // Indicate success
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error; // Re-throw to stop handleSubmit
  }
}