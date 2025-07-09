"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import { LoginFormData } from "@/interfaces";
import { login } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import InputGroup from "../FormElements/InputGroup";
import { useAuth } from "../../stores/authStore";
import { useEffect } from "react";
import InputField from "../input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type FormValues = {
  email: string;
  password: string;
};

export default function SigninWithPassword() {
  const router = useRouter();

  const { loginStore } = useAuth();

  const validateFormSchema = z.object({
    email: z.string().min(1, "Mã khách hàng là bắt buộc"),
    password: z.string().min(1, "Người phụ trách là bắt buộc"),
  });

  const methods = useForm<FormValues>({
    defaultValues: {
      email: "quyetlv03@gmail.com",
      password: "123456789",
    },
    resolver: zodResolver(validateFormSchema),
  });

  const { handleSubmit, reset } = methods;

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (data: any) => {
      console.log("login data", data);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      loginStore(data.user);
      router.replace("/");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  useEffect(() => {
    document.body.style.removeProperty("pointer-events");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-4">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
        >
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
            Đăng nhập
          </h2>

          <InputField name="email" label="Email" required />

          <InputField type="password" name="password" label="Mật khẩu" required className="py-7" />

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary p-3 font-semibold text-white transition hover:bg-opacity-90 disabled:opacity-60"
            disabled={isPending}
          >
            Đăng nhập
            {isPending && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
