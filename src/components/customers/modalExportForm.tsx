"use client";

import { downloadFile, printFilledTemplate } from "@/app/customers/config";
import { getAllForm } from "@/services/form";
import * as Dialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { FiDownload, FiPrinter } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useCustomerStore } from "../../stores/customerStore";
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

  if (isLoading) {
    return (
      <Dialog.Root open={open} onOpenChange={(open) => !open && handleClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[99998] bg-black/30" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[99999] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform overflow-auto scroll-auto rounded-lg bg-white p-0 shadow-lg flex items-center justify-center min-h-[300px]">
            <Loading />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  const isEmpty = !data?.data || data.data.length === 0;

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
              {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <svg
                    width="64"
                    height="64"
                    fill="none"
                    viewBox="0 0 64 64"
                    className="mb-4 text-gray-300"
                  >
                    <rect width="64" height="64" rx="12" fill="#F3F4F6" />
                    <path
                      d="M20 44V20a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v24a2 2 0 0 1-2 2H22a2 2 0 0 1-2-2Z"
                      stroke="#A0AEC0"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M24 28h16M24 36h16"
                      stroke="#A0AEC0"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p className="text-gray-500 text-lg font-medium">
                    Không có mẫu nào để xuất dữ liệu.
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Vui lòng thêm mẫu biểu mẫu trước khi xuất dữ liệu khách hàng.
                  </p>
                </div>
              ) : (
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
              )}
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

export default ModalExportForm;
