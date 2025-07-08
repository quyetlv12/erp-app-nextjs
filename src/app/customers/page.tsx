'use client'
import ModalAddCustomer from '@/components/customers/modalAddCustomer';
import ModalDetailCustomer from '@/components/customers/modalDetailCustomer';
import TableCustom from '@/components/Tables/table';
import Title from '@/components/title';
import { Button } from '@/components/ui-elements/button';
import { useState } from 'react';
import { FaDownload, FaEdit, FaPrint, FaTrash } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import { customerData, customerTypes } from './config';




const Page = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);


    const [itemSelect, setItemSelect] = useState(null)

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleOpenodal = () => {
        setIsModalOpen(true);
    };



    const handleCloseModalDetail = () => {
        setItemSelect(null)
        setIsModalOpenDetail(false);
    };


    const handleOpenodalDetail = (item: any) => {
        setItemSelect(item)
        setIsModalOpenDetail(true);
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
            key: 'code',
            label: 'Mã khách hàng',
        },
        {
            key: 'name',
            label: 'Thông tin khách hàng',
            render: (value: string, item: any) => (
                <button
                    className="text-primary underline hover:opacity-80"
                    onClick={handleOpenodalDetail}
                >
                    {value}
                </button>
            ),
        },
        {
            key: 'createdAt',
            label: 'Ngày tạo',
            render: (value: string) => (
                <span>{value}</span>
            ),
        },
        {
            key: 'type',
            label: 'Phân loại khách hàng',
            render: (value: string, item: any) => (
                <select
                    className="border rounded px-2 py-1"
                    defaultValue={value}
                    onChange={e => alert(`Đổi phân loại cho ${item.name} thành ${e.target.value}`)}
                >
                    {customerTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            ),
        },
        {
            key: 'createdBy',
            label: 'Người nhập',
        },
        {
            key: 'inCharge',
            label: 'Người phụ trách',
        },
        {
            key: 'actions',
            label: 'Hành động',
            render: (_: any, item: any) => (
                <div className="flex gap-2 justify-end">
                    <button
                        title="Sửa"
                        className="p-1 rounded hover:bg-blue-100 text-blue-600"
                        onClick={() => alert(`Sửa khách hàng: ${item.name}`)}
                    >
                        <FaEdit />
                    </button>
                    <button
                        title="Xóa"
                        className="p-1 rounded hover:bg-red-100 text-red-600"
                        onClick={() => window.confirm(`Bạn có chắc muốn xóa khách hàng: ${item.name}?`) && alert(`Đã xóa khách hàng: ${item.name}`)}
                    >
                        <FaTrash />
                    </button>
                    <button
                        title="In biểu mẫu"
                        className="p-1 rounded hover:bg-green-100 text-green-600"
                        onClick={() => alert(`In biểu mẫu cho khách hàng: ${item.name}`)}
                    >
                        <FaPrint />
                    </button>
                    <button
                        title="Tải về biểu mẫu"
                        className="p-1 rounded hover:bg-gray-100 text-gray-600"
                        onClick={() => alert(`Tải về biểu mẫu cho khách hàng: ${item.name}`)}
                    >
                        <FaDownload />
                    </button>
                </div>
            ),
        },
    ];



    const dataWithIndex = customerData.map((item, idx) => ({ ...item, stt: idx + 1 }));
    return (
        <div>
            <div className='flex justify-between items-center mb-10'>
                <Title title='Quản lý khách hàng' />
                <Button
                    label="Thêm khách hàng"
                    variant="primary"
                    size="small"
                    icon={<IoMdAdd size={30} />}
                    className='rounded-lg'
                    onClick={handleOpenodal}

                />
            </div>
            <TableCustom
                data={dataWithIndex}
                columns={columns}
            />


            <ModalAddCustomer open={isModalOpen} onClose={handleCloseModal} />
            <ModalDetailCustomer open={isModalOpenDetail} onClose={handleCloseModalDetail} initialData={itemSelect} />
        </div>
    )
}

export default Page