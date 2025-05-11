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
    await axios.get(`${sanctumBaseUrl}/sanctum/csrf-cookie`);
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error; // Re-throw to stop handleSubmit
  }
}