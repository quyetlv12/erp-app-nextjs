"use client";

import { getAllForm } from "@/services/form";
import * as Dialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { IoMdClose } from "react-icons/io";
import { FiDownload, FiPrinter } from "react-icons/fi";
import { useCustomerStore } from "../../stores/customerStore";
import { downloadFile, printFilledTemplate } from "@/app/customers/config";
import { useState } from "react";
import Loading from "../loading";

const ModalExportForm = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { selectedCustomer } = useCustomerStore();
  const { data, isLoading } = useQuery({
    queryKey: ["forms"],
    queryFn: getAllForm,
  });

  // Khi đóng modal, reset form đã chọn
  const handleClose = () => {
    onClose();
  };

  if(isLoading) <Loading />

  return (
    <Dialog.Root open={open} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[99998] bg-black/30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[99999] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform overflow-auto scroll-auto rounded-lg bg-white p-0 shadow-lg">
          <div className="relative p-0">
            <div className="flex items-center justify-between bg-blue-50 p-5">
              <div className="rounded-t-lg border-b border-gray-100">
                <Dialog.Title className="mb-1 text-2xl font-bold text-blue-700">
                  Chọn mẫu
                </Dialog.Title>
                <p className="text-sm text-gray-500">
                  Vui lòng chọn mẫu để xuất dữ liệu khách hàng
                </p>
              </div>

              <button
                onClick={handleClose}
                className="z-10 text-2xl text-gray-500 hover:text-gray-700"
                aria-label="Đóng"
                type="button"
              >
                <IoMdClose size={30} />
              </button>
            </div>

            <div className="px-5 py-5">
              <ul>
                {data?.data.map((form: any, index: number) => (
                  <li
                    key={index}
                    className="mb-2 flex items-center justify-between gap-4 border-b border-gray-100 py-2"
                  >
                    <span className="font-bold text-[18px] cursor-pointer">
                      {form?.name}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => downloadFile(form.file_link, selectedCustomer)}
                        className="rounded-lg px-4 py-1 font-medium transition bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                      >
                        <FiDownload className="inline-block" size={18} />
                        Xuất dữ liệu
                      </button>
                      <button
                        type="button"
                        onClick={() => printFilledTemplate(form.file_link, selectedCustomer)}
                        className="rounded-lg px-4 py-1 font-medium transition bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                      >
                        <FiPrinter className="inline-block" size={18} />
                        In
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-8 px-8 py-6">
              {/* Hành động */}
              <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg bg-gray-200 px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-300"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const DetailField = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string | undefined | null;
  className?: string;
}) => (
  <div className={`flex flex-col ${className}`}>
    <span className="mb-1 text-sm text-gray-500">{label}</span>
    <span className="break-words text-base font-medium text-gray-900">
      {value || "-"}
    </span>
  </div>
);

export default ModalExportForm;
