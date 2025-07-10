import dayjs from "dayjs";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import * as mammoth from "mammoth";
import PizZip from "pizzip";
import { FaDownload, FaEdit, FaPrint, FaTrash } from "react-icons/fa";
export const customerTypes = [
  "KH tiềm năng",
  "KH đã chốt",
  "KH thường",
  "KH khả quan",
];

export const downloadFile = async (templatePath: string, customerData: any) => {
  try {
    // 1. lấy dữ liệu
    const res = await fetch(templatePath);
    const arrayBuffer = await res.arrayBuffer();

    // 2. chuyển dữ liệu từ link thành file docx
    const zip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // 3. thay thế các biến
    doc.setData(customerData);

    try {
      doc.render(); // May throw if missing keys
    } catch (error) {
      console.error("Render error:", error);
      return;
    }

    // 4. tạo file 
    const out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // 5. lưu file
    saveAs(out, `hop_dong_${customerData.code || "khach_hang"}.docx`);
  } catch (err) {
    console.error("Lỗi tạo file:", err);
  }
};

export const printFilledTemplate = async (
  templatePath: string,
  customerData: any
) => {
  try {
    // 1. Tải template .docx
    const res = await fetch(templatePath);
    if (!res.ok) throw new Error("Không thể tải file Word mẫu");

    const arrayBuffer = await res.arrayBuffer();

    // 2. Dùng Docxtemplater để đổ dữ liệu
    const zip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.setData(customerData);

    try {
      doc.render();
    } catch (error) {
      console.error("Lỗi render template:", error);
      throw new Error("Thiếu thông tin cho các placeholder");
    }

    // 3. Sinh buffer DOCX mới
    const updatedBuffer = doc.getZip().generate({ type: "arraybuffer" });

    // 4. Dùng mammoth chuyển sang HTML
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer: updatedBuffer });

    // 5. In HTML
    const printWindow = window.open("", "_blank");
    if (!printWindow) throw new Error("Không thể mở cửa sổ in");

    printWindow.document.write(`
      <html>
        <head>
          <title>In hợp đồng</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  } catch (error: any) {
    console.error(error);
    alert(error?.message || "Lỗi khi in file");
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
