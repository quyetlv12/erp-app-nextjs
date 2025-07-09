import dayjs from "dayjs";
import { saveAs } from 'file-saver';
import { FaDownload, FaEdit, FaPrint, FaTrash } from "react-icons/fa";
import { toast } from "sonner";


export const customerTypes = [
    'KH tiềm năng',
    'KH đã chốt',
    'KH thường',
    'KH khả quan',
];


export const downloadFile = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Không thể tải file');
    const blob = await response.blob();
    saveAs(blob, 'bieumau');
};




const printFromUrl = async (url: string) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Không thể tải file để in");
        const blob = await response.blob();
        const fileType = blob.type;

        // Tạo URL cho blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Nếu là PDF hoặc hình ảnh, mở tab mới để in
        if (fileType === "application/pdf" || fileType.startsWith("image/")) {
            const printWindow = window.open(blobUrl, "_blank");
            if (printWindow) {
                printWindow.onload = () => {
                    printWindow.focus();
                    printWindow.print();
                };
            } else {
                toast.error("Không thể mở cửa sổ in");
            }
        } else {
            // Nếu là file text hoặc khác, đọc nội dung và in
            const reader = new FileReader();
            reader.onload = function (e) {
                const printWindow = window.open("", "_blank");
                if (printWindow) {
                    printWindow.document.write(`<pre>${e.target?.result}</pre>`);
                    printWindow.document.close();
                    printWindow.focus();
                    printWindow.print();
                } else {
                    toast.error("Không thể mở cửa sổ in");
                }
            };
            reader.readAsText(blob);
        }
    } catch (error: any) {
        toast.error(error?.message || "Lỗi khi in file");
    }
};

export const renderColumns = (handleOpenModalDetail: any, handleOpenEditModal: any, handleDeleteCustomer: any, deleteMutation: any) => {
    return [
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
                        onClick={() => handleDeleteCustomer(item)}
                        disabled={deleteMutation.isPending && deleteMutation.variables === item._id}
                    >
                        <FaTrash />
                    </button>
                    {
                        item.form_link && <button
                            title="In biểu mẫu"
                            className="rounded p-1 text-green-600 hover:bg-green-100"
                            onClick={() => printFromUrl(item.form_link)}
                        >
                            <FaPrint />
                        </button>
                    }

                    {
                        item.form_link && <button
                            title="Tải về biểu mẫu"
                            className="rounded p-1 text-gray-600 hover:bg-gray-100"
                            onClick={() => downloadFile(item.form_link)}
                        >
                            <FaDownload />
                        </button>
                    }

                </div>
            ),
        },
    ]
}