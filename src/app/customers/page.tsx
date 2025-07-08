"use client";
import ModalAddCustomer from "@/components/customers/modalAddCustomer";
import ModalDetailCustomer from "@/components/customers/modalDetailCustomer";
import TableCustom from "@/components/Tables/table";
import Title from "@/components/title";
import { Button } from "@/components/ui-elements/button";
import { CustomerFormData } from "@/interfaces";
import { getCustomers } from "@/services/customer";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { FaDownload, FaEdit, FaPrint, FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { customerTypes } from "./config";

const Page = () => {
  const { data } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);

  const [itemSelect, setItemSelect] = useState<CustomerFormData | any>(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };


  const handleOpenEditModal = (item  : CustomerFormData) => {    
    setItemSelect(item)
    setIsModalOpen(true);
  };



  const handleCloseModalDetail = () => {
    setItemSelect(null);
    setIsModalOpenDetail(false);
  };

  const handleOpenModalDetail = (item: any) => {
    setItemSelect(item);
    setIsModalOpenDetail(true);
  };

  const columns: any = [
    {
      key: "stt",
      label: "STT",
      render: (_: any, item: any) => {
        return item.stt;
      },
    },
    {
      key: "code",
      label: "Mã khách hàng",
    },
    {
      key: "name",
      label: "Thông tin khách hàng",
      render: (value: string, item: any) => (
        <button
          className="text-primary underline hover:opacity-80"
          onClick={() => handleOpenModalDetail(item)}
        >
          {value}
        </button>
      ),
    },

    {
      key: "type",
      label: "Phân loại khách hàng",
      render: (value: string, item: any) => (
        <select
          className="rounded border px-2 py-1"
          defaultValue={value}
          onChange={(e) =>
            alert(`Đổi phân loại cho ${item.name} thành ${e.target.value}`)
          }
        >
          {customerTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      ),
    },

    {
      key: "inCharge",
      label: "Người phụ trách",
    },
    {
      key: "createdBy",
      label: "Người nhập",
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      render: (value: string) => (
        <span>{dayjs(value).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      key: "actions",
      label: "Hành động",
      render: (_: any, item: any) => (
        <div className="flex justify-end gap-2">
          <button
            title="Sửa"
            className="rounded p-1 text-blue-600 hover:bg-blue-100"
            onClick={() => handleOpenEditModal(item)}
          >
            <FaEdit />
          </button>
          <button
            title="Xóa"
            className="rounded p-1 text-red-600 hover:bg-red-100"
            onClick={() =>
              window.confirm(
                `Bạn có chắc muốn xóa khách hàng: ${item.name}?`,
              ) && alert(`Đã xóa khách hàng: ${item.name}`)
            }
          >
            <FaTrash />
          </button>
          <button
            title="In biểu mẫu"
            className="rounded p-1 text-green-600 hover:bg-green-100"
            onClick={() => alert(`In biểu mẫu cho khách hàng: ${item.name}`)}
          >
            <FaPrint />
          </button>
          <button
            title="Tải về biểu mẫu"
            className="rounded p-1 text-gray-600 hover:bg-gray-100"
            onClick={() =>
              alert(`Tải về biểu mẫu cho khách hàng: ${item.name}`)
            }
          >
            <FaDownload />
          </button>
        </div>
      ),
    },
  ];

  const dataWithIndex = useCallback(() => {
    if (!data?.data) return [];
    return data.data.map((item: CustomerFormData, idx: number) => ({
      ...item,
      stt: idx + 1,
    }));
  }, [data]);
  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <Title title="Quản lý khách hàng" />
        <Button
          label="Thêm khách hàng"
          variant="primary"
          size="small"
          icon={<IoMdAdd size={30} />}
          className="rounded-lg"
          onClick={handleOpenModal}
        />
      </div>
      <TableCustom data={dataWithIndex()} columns={columns} />

      <ModalAddCustomer open={isModalOpen} onClose={handleCloseModal} />
      <ModalDetailCustomer
        open={isModalOpenDetail}
        onClose={handleCloseModalDetail}
        initialData={itemSelect}
      />
    </div>
  );
};

export default Page;
