'use client';

import ModalImportForm from '@/components/forms/modalImportForm';
import Loading from '@/components/loading';
import TableCustom from '@/components/Tables/table';
import Title from '@/components/title';
import { Button } from '@/components/ui-elements/button';
import { deleteForm, getAllForm } from '@/services/form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { FaDownload, FaTrash } from "react-icons/fa6";
import { downloadFile } from '../customers/config';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'sonner';

export default function FormTemplateManager() {



    const { data, isLoading } = useQuery({
        queryKey: ["forms"],
        queryFn: getAllForm,
    });
    const queryClient = useQueryClient();


    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return deleteForm(id);
        },
        onSuccess: () => {
            toast.success("Xóa mẫu thành công");
            queryClient.invalidateQueries({ queryKey: ["forms"] });
        },
        onError: (error: any) => {
            toast.error(error?.message || "Xóa mẫu thất bại");
        },
    });

    const handleDeleteForm = (item: any) => {
        confirmAlert({
            title: 'Xác nhận xoá khách hàng',
            message: `Bạn có chắc chắn muốn xoá mẫu này"?`,
            buttons: [
                {
                    label: 'Xoá',
                    onClick: () => {
                        deleteMutation.mutate(item._id);
                    },
                    className: "bg-red-500 text-white"
                },
                {
                    label: 'Huỷ',
                    onClick: () => { },
                    className: "bg-gray-200"
                }
            ],
            closeOnClickOutside: true,
            overlayClassName: "z-[9999]"
        });
    };



    const columns: any = [
        {
            key: 'stt',
            label: 'STT',
            render: (_: any, item: any) => {
                return item.stt
            },
        },
        {
            key: 'name',
            label: 'Tên biểu mẫu',
        },
        {
            key: 'placeholders',
            label: 'Giá trị',
            render: (value: any) => (
                <ul>
                    {
                        value.map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                        ))
                    }
                </ul>
            ),
        },
        {
            key: 'createdAt',
            label: 'Ngày tạo',
            render: (value: string) => (
                <span>{dayjs(value).format('DD-MM-YYYY')}</span>
            ),
        },
        {
            key: 'file_link',
            label: 'Đường dẫn file',
            render: (value: string) => (
                <span>
                    <a href={value} target='_blank' className='underline text-blue-500'>Xem file</a>
                </span>
            ),
        },
        {
            key: 'createdBy',
            label: 'Người nhập',
            render: (value: string) => (
                <p className='flex justify-end'>{value}</p>
            ),
        },
        {
            key: "actions",
            label: "Hành động",
            render: (_: any, item: any) => (
                <div className="flex justify-end gap-2">

                    <button
                        title="Xóa"
                        className="rounded p-1 text-red-600 hover:bg-red-100"
                        onClick={() => handleDeleteForm(item)}
                        disabled={deleteMutation.isPending && deleteMutation.variables === item._id}
                    >
                        <FaTrash size={25} />
                    </button>

                </div>
            ),
        },
    ];





    const [isModalOpen, setIsModalOpen] = useState(false);



    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleOpenodal = () => {
        setIsModalOpen(true);
    };

    if (isLoading) {
        return <Loading />
    }
    const file_template_url = 'https://res.cloudinary.com/djuggkbyg/raw/upload/v1752034350/forms/ov8acfpbps46durpmokt.txt'

    const dataWithIndex = data?.data.map((item: any, idx: number) => ({ ...item, stt: idx + 1 }));
    return (
        <div>
            <div className='flex justify-between items-center mb-10'>
                <Title title='Quản lý biểu mẫu' />
                <div className='flex gap-2'>
                    <Button
                        label="Tải mẫu"
                        variant="primary"
                        size="small"
                        icon={<FaDownload size={20} />}
                        className='rounded-lg'
                        onClick={() => downloadFile(file_template_url)}

                    />
                    <Button
                        label="Thêm biểu mẫu"
                        variant="primary"
                        size="small"
                        icon={<IoMdAdd size={30} />}
                        className='rounded-lg'
                        onClick={handleOpenodal}

                    />
                </div>
            </div>
            <TableCustom
                data={dataWithIndex || []}
                columns={columns}
            />


            <ModalImportForm open={isModalOpen} onClose={handleCloseModal} />
        </div>
    )
}
