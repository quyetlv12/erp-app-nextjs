"use client";
import ModalAddCustomer from "@/components/customers/modalAddCustomer";
import ModalDetailCustomer from "@/components/customers/modalDetailCustomer";
import Loading from "@/components/loading";
import TableCustom from "@/components/Tables/table";
import Title from "@/components/title";
import { Button } from "@/components/ui-elements/button";
import { CustomerFormData } from "@/interfaces";
import { deleteCustomer, getCustomers } from "@/services/customer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { IoMdAdd } from "react-icons/io";
import { toast } from "sonner";
import { useCustomerStore } from "../../stores/customerStore";
import { renderColumns } from "./config";
import ModalExportForm from "@/components/customers/modalExportForm";

const Page = () => {
    const {
        selectCustomer,
        resetSelectCustomer
    } = useCustomerStore();

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["customers"],
        queryFn: getCustomers,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenForm, setIsModalOpenForm] = useState(false);

    const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return deleteCustomer(id);
        },
        onSuccess: () => {
            toast.success("Xóa khách hàng thành công");
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
        onError: (error: any) => {
            toast.error(error?.message || "Xóa khách hàng thất bại");
        },
    });

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: CustomerFormData) => {
        selectCustomer(item)
        setIsModalOpen(true);
    };

    const handleCloseModalDetail = () => {
        resetSelectCustomer();
        setIsModalOpenDetail(false);
    };

    const handleOpenModalDetail = (item: any) => {
        selectCustomer(item);
        setIsModalOpenDetail(true);
    };


    const handleCloseModalForm = () => {
        resetSelectCustomer();
        setIsModalOpenForm(false);
    };

    const handleOpenModalForm = (item: any) => {
        console.log("item" , item);
        
        selectCustomer(item);
        setIsModalOpenForm(true);
    };

    const handleDeleteCustomer = (item: CustomerFormData) => {
        confirmAlert({
            title: 'Xác nhận xoá khách hàng',
            message: `Bạn có chắc chắn muốn xoá khách hàng "${item.name}"?`,
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

    const columns: any = renderColumns(handleOpenModalDetail,
        handleOpenEditModal,
        handleDeleteCustomer,
        deleteMutation,
        handleOpenModalForm
    );

    const dataWithIndex = useCallback(() => {
        if (!data?.data) return [];
        return data.data.map((item: CustomerFormData, idx: number) => ({
            ...item,
            stt: idx + 1,
        }));
    }, [data]);

    if (isLoading) {
        return <Loading />;
    }

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
            />
            <ModalExportForm
                open={isModalOpenForm}
                onClose={handleCloseModalForm}
            />
        </div>
    );
};

export default Page;
