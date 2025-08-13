import axios, { AxiosError } from "axios";

export function normalizeError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;
    const apiMessage = typeof data === "object" && data?.message
      ? data.message
      : error.message;
    ;
    return new Error(`${apiMessage}`);
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error(String(error || "Erro desconhecido"));
}