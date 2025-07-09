import "@/css/satoshi.css";
import "@/css/style.css";


import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import AuthGuard from "@/components/Layouts/AuthGuard";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { type PropsWithChildren } from "react";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Providers } from "./providers";
export const metadata: Metadata = {
  title: {
    template: "ERP Admin",
    default: "ERP Admin",
  },
};


export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />
          <AuthGuard>{children}</AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
