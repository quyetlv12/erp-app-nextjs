import httpClient from "@/api/httpClient";

export const getAllForm = async ({ queryKey }: { queryKey: any }) => {
    const [_, query] = queryKey;
    const response = await httpClient.get("/forms", {
        params: query,
    });
    return response.data;
};
export const importForm = async (data: FormData) => {
    const response = await httpClient.post("/forms", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}
export const deleteForm = async (id: string) => {
    const response = await httpClient.delete(`/forms/${id}`);
    return response.data;
  };
  