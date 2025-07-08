'use client';

import { CustomerFormData } from '@/interfaces';
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { customerTypes, inChargeOptions, defaultForm } from './formConfig';

const getLabel = (options: { label: string; value: string }[], value: string) => {
    const found = options.find(opt => opt.value === value);
    return found ? found.label : value || '-';
};

const ModalDetailCustomer = ({
    open,
    onClose,
    initialData,
}: {
    open: boolean;
    onClose: () => void;
    initialData?: any;
}) => {
    const [data, setData] = useState<CustomerFormData>(defaultForm);

    useEffect(() => {
        setData(initialData || defaultForm);
    }, [initialData, open]);

    return (
        <Dialog.Root open={open} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/30 z-[99998]" />
                <Dialog.Content className="fixed top-1/2 left-1/2 z-[99999] w-full max-w-2xl bg-white p-0 rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2 h-[90vh] overflow-auto scroll-auto">
                    <div className="relative p-0">
                        <div className="flex justify-between items-center bg-blue-50 p-5">
                            <div className="border-b border-gray-100 rounded-t-lg">
                                <Dialog.Title className="text-2xl font-bold text-blue-700 mb-1">
                                    Thông tin chi tiết khách hàng
                                </Dialog.Title>
                                <p className="text-gray-500 text-sm">
                                    Xem chi tiết thông tin khách hàng trong hệ thống
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
                        <div className="space-y-8 px-8 py-6">
                            {/* Thông tin chung */}
                            <div>
                                <h3 className="font-semibold text-base text-blue-600 mb-3">
                                    1. Thông tin chung
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <DetailField label="Mã khách hàng" value={data.code} />
                                    <DetailField label="Người phụ trách" value={getLabel(inChargeOptions, data.inCharge)} />
                                    <DetailField label="Phân loại khách hàng" value={getLabel(customerTypes, data.type)} />
                                </div>
                            </div>

                            {/* Thông tin khách hàng */}
                            <div>
                                <h3 className="font-semibold text-base text-blue-600 mb-3">
                                    2. Thông tin khách hàng
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <DetailField label="Tên khách hàng" value={data.name} />
                                    <DetailField label="Mã số thuế" value={data.taxCode} />
                                    <DetailField label="Ngày cấp giấy phép KD" value={data.businessLicenseDate} />
                                    <DetailField label="Người đại diện" value={data.representative} />
                                    <DetailField label="Chức vụ" value={data.position} />
                                    <DetailField label="Email" value={data.email} />
                                </div>
                                <DetailField label="Số điện thoại" value={data.phone} className="py-5" />
                                <DetailField label="Địa chỉ" value={data.address} className="md:col-span-2" />
                            </div>

                            {/* Hành động */}
                            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium transition"
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
    className = '',
}: {
    label: string;
    value: string | undefined;
    className?: string;
}) => (
    <div className={`flex flex-col ${className}`}>
        <span className="text-gray-500 text-sm mb-1">{label}</span>
        <span className="text-base font-medium text-gray-900 break-words">{value || '-'}</span>
    </div>
);

export default ModalDetailCustomer;
