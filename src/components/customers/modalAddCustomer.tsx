'use client';

import { CustomerFormData } from '@/interfaces';
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoMdClose } from 'react-icons/io';
import InputField from '../input';
import {
  customerTypes,
  defaultForm,
  inChargeOptions,
  customerFormSchema,
} from './formConfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCustomer, updateCustomer } from '@/services/customer';
import { toast } from 'sonner';
import { useCustomerStore } from '../../stores/customerStore';
import { useAuth } from '../../stores/authStore';

const ModalAddCustomer = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const {
    selectedCustomer,
    resetSelectCustomer
  } = useCustomerStore();

  const {user } = useAuth()

  const methods = useForm<CustomerFormData>({
    defaultValues: defaultForm,
    resolver: zodResolver(customerFormSchema),
  });

  const { handleSubmit, reset } = methods;

  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      toast.success('Thêm khách hàng thành công');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Thêm khách hàng thất bại');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CustomerFormData }) => {
      return updateCustomer(id, data);
    },
    onSuccess: () => {
      toast.success('Cập nhật khách hàng thành công');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Cập nhật khách hàng thất bại');
    },
  });

  const handleAddCustomer = (data: CustomerFormData) => {
    const _data = {...data , createdBy : user?.name}
    if (selectedCustomer) {
      updateMutation.mutate({ id: selectedCustomer['_id'], data });
    } else {
      addMutation.mutate(_data);
    }
  };

  useEffect(() => {
    reset(selectedCustomer || defaultForm);
  }, [selectedCustomer, open, reset]);

  return (
    <Dialog.Root open={open} onOpenChange={(open) => {
      reset()
      resetSelectCustomer()
      !open && onClose()
    }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-[99998]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-[99999] w-full max-w-2xl bg-white p-0 rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2 h-[90vh] overflow-auto scroll-auto">
          <div className="relative p-0">
            <div className="flex justify-between items-center bg-blue-50 p-5">
              <div className="border-b border-gray-100 rounded-t-lg">
                <Dialog.Title className="text-2xl font-bold text-blue-700 mb-1">
                  {selectedCustomer ? 'Sửa thông tin khách hàng' : 'Thêm mới khách hàng'}
                </Dialog.Title>
                <p className="text-gray-500 text-sm">
                  {selectedCustomer
                    ? 'Cập nhật thông tin khách hàng trong hệ thống'
                    : 'Điền thông tin để thêm khách hàng mới'}
                </p>
              </div>
              <button
                onClick={() => {
                  reset()
                  resetSelectCustomer()
                  onClose()
                }} className="text-gray-500 hover:text-gray-700 text-2xl z-10"
                aria-label="Đóng"
                type="button"
              >
                <IoMdClose size={30} />
              </button>
            </div>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(handleAddCustomer)}
                className="space-y-8 px-8 py-6"
              >
                {/* Thông tin chung */}
                <div>
                  <h3 className="font-semibold text-base text-blue-600 mb-3">
                    1. Thông tin chung
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField
                      name="code"
                      label="Mã khách hàng"
                      required
                      disabled={!!selectedCustomer}
                    />
                    <InputField
                      name="inCharge"
                      label="Người phụ trách"
                      type="select"
                      required
                      options={inChargeOptions}
                    />
                    <InputField
                      name="type"
                      label="Phân loại khách hàng"
                      type="select"
                      required
                      options={customerTypes}
                    />
                  </div>
                </div>

                {/* Thông tin khách hàng */}
                <div>
                  <h3 className="font-semibold text-base text-blue-600 mb-3">
                    2. Thông tin khách hàng
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField name="name" label="Tên khách hàng" required />
                    <InputField name="taxCode" label="Mã số thuế" required />
                    <InputField
                      required
                      name="businessLicenseDate"
                      label="Ngày cấp giấy phép KD"
                      type="date"
                    />
                    <InputField required name="representative" label="Người đại diện" />
                    <InputField required name="position" label="Chức vụ" />
                    <InputField required name="email" label="Email" type="email" />
                  </div>
                  <InputField
                    required
                    name="phone"
                    label="Số điện thoại"
                    type="tel"
                    className="py-5"
                  />
                  <InputField
                    required
                    name="address"
                    label="Địa chỉ"
                    className="md:col-span-2"
                  />
                </div>

                {/* Hành động */}
                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={addMutation.isPending || updateMutation.isPending}
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition disabled:opacity-60"
                  >
                    {(addMutation.isPending || updateMutation.isPending)
                      ? 'Đang xử lý...'
                      : selectedCustomer?._id ? 'Cập nhật' : 'Thêm mới'}
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

export default ModalAddCustomer;
