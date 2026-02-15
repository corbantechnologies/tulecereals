/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { Shop } from "./shops";

export interface User {
  id: string;
  usercode: string;
  email: string;
  first_name: string;
  last_name: string;
  country: string;
  phone_number: string | null;
  county: string | null;
  town: string | null;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  is_vendor: boolean;
  is_customer: boolean;
  shop: Shop | null;
}

export interface updateUser {
  email: string;
  first_name: string;
  last_name: string;
  country: string;
  phone_number: string | null;
  county: string | null;
  town: string | null;
}

export interface forgotPassword {
  email: string;
}

export interface resetPassword {
  email: string;
  code: string;
  password: string;
  password_confirmation: string;
}

export interface SignupCustomer {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  country: string;
  phone_number: string | null;
}

export const getAccount = async (
  usercode: string,
  headers: { headers: { Authorization: string } }
): Promise<User> => {
  const response: AxiosResponse<User> = await apiActions.get(
    `/api/v1/auth/${usercode}/`,
    headers
  );
  return response.data;
};

export const forgotPassword = async (data: forgotPassword): Promise<any> => {
  const response: AxiosResponse<any> = await apiActions.post(
    `/api/v1/auth/password/forgot/`,
    data
  );
  return response.data;
};

export const resetPassword = async (data: resetPassword): Promise<any> => {
  const response: AxiosResponse<any> = await apiActions.post(
    `/api/v1/auth/password/reset/`,
    data
  );
  return response.data;
};

export const signupCustomer = async (data: SignupCustomer): Promise<any> => {
  const response: AxiosResponse<any> = await apiActions.post(
    `/api/v1/auth/signup/customer/`,
    data
  );
  return response.data;
};

export const updateAccount = async (
  usercode: string,
  data: updateUser,
  headers: { headers: { Authorization: string } }
): Promise<User> => {
  const response: AxiosResponse<User> = await apiActions.patch(
    `/api/v1/auth/${usercode}/`,
    data,
    headers
  );
  return response.data;
};

export const deleteAccount = async (
  usercode: string,
  headers: { headers: { Authorization: string } }
): Promise<User> => {
  const response: AxiosResponse<User> = await apiActions.delete(
    `/api/v1/auth/${usercode}/`,
    headers
  );
  return response.data;
};