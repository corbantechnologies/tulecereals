/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiActions } from "@/tools/axios";

interface mpesaPayload {
    order_reference: string;
    phone_number: number;
}

export const generateDepositSTKPush = async (payload: mpesaPayload) => {
  const response = await apiActions.post("/api/v1/mpesa/pay/", payload);
  return response.data;
};
