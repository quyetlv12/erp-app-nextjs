'use client';

import InputField from '@/components/input';
import { importForm } from '@/services/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { FormProvider, useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'sonner';
import { useAuth } from '../../stores/authStore';
import { defaultForm, ImportFormData, importFormSchema } from './formConfig';
const ModalImportForm = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const methods = useForm<ImportFormData>({
    resolver: zodResolver(importFormSchema),
    defaultValues: defaultForm,
  });
  const { user } = useAuth()

  const { handleSubmit, reset, formState: { errors } } = methods;
  const queryClient = useQueryClient();

  console.log("errors", errors);

  const { mutate, isPending } = useMutation({
    mutationKey: ['importForm'],
    mutationFn: importForm,
    onSuccess: () => {
      toast.success('Thêm dữ liệu hàng thành công');
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      reset()
      onClose();


    }
  })
  const handleImport = async (data: ImportFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);

    if (!data.file || data.file.length === 0) return;

    const file = data.file[0];
    formData.append("file", file);

    // Đọc nội dung file DOCX
    const arrayBuffer = await file.arrayBuffer();

    try {
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Trích xuất tất cả placeholder (biến trong file Word)
      const tags = doc.getFullText().match(/{([^{}]+)}/g) || [];
      const placeholders = [...new Set(tags.map((m) => m.replace(/[{}]/g, "").trim()))];

      formData.append("placeholders", JSON.stringify(placeholders));
    } catch (err) {
      console.error("Lỗi đọc file DOCX:", err);
      toast.error("Không thể đọc nội dung file Word");
      return;
    }

    if (user) formData.append("createdBy", user?.name);

    mutate(formData);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-[99998]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-[99999] w-full max-w-md bg-white p-0 rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative p-0">
            <div className="flex justify-between items-center bg-blue-50 p-5">
              <div className="border-b border-gray-100 rounded-t-lg">
                <Dialog.Title className="text-2xl font-bold text-blue-700 mb-1">
                  Nhập dữ liệu từ file
                </Dialog.Title>
                <p className="text-gray-500 text-sm">
                  Điền tên biểu mẫu và chọn file để nhập dữ liệu
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl z-10"
                aria-label="Đóng"
                type="button"
              >
                <IoMdClose size={30} />
              </button>
            </div>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(handleImport)}
                className="space-y-8 px-8 py-6"
              >
                <div className="space-y-6">
                  <div>
                    <InputField
                      name="name"
                      label="Tên biểu mẫu"
                      type="text"
                      placeholder="Nhập tên biểu mẫu"
                      required
                    />
                  </div>
                  <div>
                    <InputField
                      name="file"
                      label="Tải file"
                      type="file"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      reset();
                    }}
                    className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition"
                  >
                    {
                      isPending ? 'Đang xử lý ...' : 'Nhập dữ liệu'
                    }

                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ModalImportForm;
