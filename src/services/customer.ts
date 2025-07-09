import httpClient from "@/api/httpClient";
import { CustomerFormData } from "@/interfaces";

export const getCustomers = async ({ queryKey }: { queryKey: any }) => {
  const [_, query] = queryKey;
  const response = await httpClient.get("/customers", {
    params: query,
  });
  return response.data;
};

export const createCustomer = async (data: CustomerFormData) => {
  const response = await httpClient.post("/customers", data);
  return response.data;
};

export const updateCustomer = async (id: string, data: CustomerFormData) => {
  const response = await httpClient.put(`/customers/${id}`, data);
  return response.data;
};

export const deleteCustomer = async (id: string) => {
  const response = await httpClient.delete(`/customers/${id}`);
  return response.data;
};
