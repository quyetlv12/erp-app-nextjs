'use client';

import { EmailIcon, PasswordIcon } from '@/assets/icons';
import { LoginFormData } from '@/interfaces';
import { login } from '@/services/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import InputGroup from '../FormElements/InputGroup';
import { useAuth } from '../../stores/authStore';
import { useEffect } from 'react';

type FormValues = {
  email: string;
  password: string;
};

export default function SigninWithPassword() {
  const router = useRouter();


  const { loginStore } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: 'quyetlv03@gmail.com',
      password: '123456789',
    },
  });

  const { mutate, isPending, error } = useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess: (data: any) => {
      console.log("login data", data);
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      loginStore(data.user)
      router.replace('/')
    }

  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  useEffect(() => {
    document.body.style.removeProperty("pointer-events");
  }, [])


  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Đăng nhập</h2>

        <InputGroup
          type="email"
          label="Email"
          placeholder="Nhập địa chỉ email ..."
          className="mb-4 [&_input]:py-[15px]"
          icon={<EmailIcon />}
          {...register("email", { required: "Email là bắt buộc" })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
        )}

        <InputGroup
          type="password"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu của bạn"
          className="mb-4 [&_input]:py-[15px]"
          icon={<PasswordIcon />}
          {...register("password", { required: "Mật khẩu là bắt buộc" })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
        )}

        {error && (
          <div className="mb-4 text-red-500 text-sm">
            {(error as Error).message || "Đăng nhập thất bại"}
          </div>
        )}

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
    </div>

  );
}
