'use client';

import ModalAddCustomer from '@/components/customers/modalAddCustomer';
import ModalImportForm from '@/components/forms/modalImportForm';
import TableCustom from '@/components/Tables/table';
import Title from '@/components/title';
import { Button } from '@/components/ui-elements/button';
import React, { useRef, useState } from 'react';
import { FaDownload, FaEdit, FaPrint, FaTrash } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';

interface Template {
    name: string;
    content: string;
    placeholders: string[];
}

// giả định dữ liệu khách hàng
const mockCustomer = {
    'Tên khách hàng': 'Công ty ABC',
    'Mã hợp đồng': 'HD-001',
    'Mã số thuế': '123456789',
    'Ngày cấp GĐKKD': '01/01/2023',
};

export default function FormTemplateManager() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [name, setName] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    const handleUpload = async () => {
        const file = fileRef.current?.files?.[0];
        if (!file || !name) return alert('Vui lòng chọn file và nhập tên biểu mẫu');

        const text = await file.text();

        const placeholders = Array.from(new Set([...text.matchAll(/\{(.*?)\}/g)].map(m => m[1])));

        const newTemplate: Template = {
            name,
            content: text,
            placeholders,
        };

        setTemplates(prev => [...prev, newTemplate]);
        setName('');
        if (fileRef.current) fileRef.current.value = '';
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
            key: 'createdAt',
            label: 'Ngày tạo',
            render: (value: string) => (
                <span>{value}</span>
            ),
        },
        {
            key: 'createdBy',
            label: 'Người nhập',
        },
    ];





    const [isModalOpen, setIsModalOpen] = useState(false);



    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleOpenodal = () => {
        setIsModalOpen(true);
    };


    // const dataWithIndex = customerData.map((item, idx) => ({ ...item, stt: idx + 1 }));
    return (
        <div>
            <div className='flex justify-between items-center mb-10'>
                <Title title='Quản lý biểu mẫu' />
                <Button
                    label="Thêm biểu mẫu"
                    variant="primary"
                    size="small"
                    icon={<IoMdAdd size={30} />}
                    className='rounded-lg'
                    onClick={handleOpenodal}

                />
            </div>
            <TableCustom
                data={[]}
                columns={columns}
            />


            <ModalImportForm open={isModalOpen} onClose={handleCloseModal} />
        </div>
    )
}
