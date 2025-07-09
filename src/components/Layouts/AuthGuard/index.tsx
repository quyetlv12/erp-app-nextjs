'use client';

import { Header } from '@/components/Layouts/header';
import { Sidebar } from '@/components/Layouts/sidebar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { useAuth } from '../../../stores/authStore';

interface Props {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: Props) {
    const { user } = useAuth()
    const router = useRouter()
    useEffect(() => {
        const user = localStorage.getItem('token')
        if (!user) {
            document.body.style.removeProperty("pointer-events");
            router.replace('/auth/sign-in')
        }
    }, [router])

    return (
        <div className="flex min-h-screen">
            {
                user && <Sidebar />
            }

            <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
                {
                    user && <Header />
                }


                <Toaster position="top-right"
                    richColors
                    theme="light"
                    toastOptions={{
                        classNames: {
                            toast: 'rounded-xl bg-yellow-50 text-yellow-800 border border-yellow-300 shadow-lg',
                            title: 'font-semibold',
                            description: 'text-sm text-yellow-700',
                            actionButton: 'bg-yellow-500 text-white hover:bg-yellow-600 rounded-md px-3 py-1',
                            cancelButton: 'text-gray-600 hover:text-gray-800',
                        },
                    }} />
                <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
