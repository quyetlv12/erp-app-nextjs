import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { FaDownload, FaEdit, FaPrint, FaTrash } from "react-icons/fa";
import { toast } from "sonner";

export const customerTypes = [
  "KH tiềm năng",
  "KH đã chốt",
  "KH thường",
  "KH khả quan",
];

export const downloadFile = async (templatePath: string, customerData: any) => {
  // 1. Tải file mẫu từ đường dẫn
  const res = await fetch(templatePath);
  const templateText = await res.text();

  // 2. Thay thế biến trong mẫu
  const filledText = templateText.replace(/\{(.*?)\}/g, (_, key) => {
    const value = customerData[key.trim()];
    return value !== undefined && value !== null ? String(value) : "-";
  });

  // 3. Tạo và tải file
  const blob = new Blob([filledText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `form-${customerData.code || "export"}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

export const printFilledTemplate = async (
  templatePath: string,
  customerData: any,
) => {
  try {
    const res = await fetch(templatePath);
    if (!res.ok) throw new Error("Không thể tải mẫu dữ liệu");

    const templateText = await res.text();

    const filledText = templateText.replace(/\{(.*?)\}/g, (_, key) => {
      const trimmedKey = key.trim();
      const value = customerData[trimmedKey];
      return value !== undefined && value !== null ? String(value) : "-";
    });

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Không thể mở cửa sổ in");
      return;
    }

    // Ghi nội dung và in
    printWindow.document.write(`
        <html>
          <head>
            <title>In dữ liệu khách hàng</title>
            <style>
              body { font-family: Arial, sans-serif; white-space: pre-wrap; padding: 20px; }
            </style>
          </head>
          <body>${filledText}</body>
        </html>
      `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  } catch (error: any) {
    toast.error(error?.message || "Lỗi khi in file");
  }
};

export const renderColumns = (
  handleOpenModalDetail: any,
  handleOpenEditModal: any,
  handleDeleteCustomer: any,
  deleteMutation: any,
  handleOpenModalForm: any,
) => {
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
            <FaEdit size={20} />
          </button>
          <button
            title="Xóa"
            className="rounded p-1 text-red-600 hover:bg-red-100"
            onClick={() => handleDeleteCustomer(item)}
            disabled={
              deleteMutation.isPending && deleteMutation.variables === item._id
            }
          >
            <FaTrash size={20} />
          </button>
          <button
            title="In biểu mẫu"
            className="rounded p-1 text-green-600 hover:bg-green-100"
            onClick={() => handleOpenModalForm(item)}
          >
            <FaPrint size={20} />
          </button>

          <button
            title="Tải về biểu mẫu"
            className="rounded p-1 text-gray-600 hover:bg-gray-100"
            onClick={() => handleOpenModalForm(item)}
          >
            <FaDownload size={20} />
          </button>
        </div>
      ),
    },
  ];
};
