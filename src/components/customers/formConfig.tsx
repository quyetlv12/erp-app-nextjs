import { CustomerFormData } from "@/interfaces";
import { z } from "zod";

export const customerTypes = [
  { label: "KH tiềm năng", value: "KH tiềm năng" },
  { label: "KH đã chốt", value: "KH đã chốt" },
  { label: "KH thường", value: "KH thường" },
  { label: "KH khả quan", value: "KH khả quan" },
];
export const inChargeOptions = [
  { label: "Lê Văn C", value: "Lê Văn C" },
  { label: "Phạm Thị F", value: "Phạm Thị F" },
  { label: "Nguyễn Văn E", value: "Nguyễn Văn E" },
  { label: "Trần Thị B", value: "Trần Thị B" },
];
// export const defaultForm: CustomerFormData = {
//   code: "ty6575",
//   inCharge: "Phạm Thị F",
//   type: "KH đã chốt",
//   name: "khách hàng",
//   taxCode: "5345435",
//   businessLicenseDate: "2001-03-09",
//   representative: "người đại diện",
//   position: "ewrewr",
//   email: "sdf@gmail.com",
//   phone: "08696804050",
//   address: "rưerwererw",
// };



export const defaultForm: CustomerFormData = {
    code: "",
    inCharge: "",
    type: "",
    name: "",
    taxCode: "",
    businessLicenseDate: "",
    representative: "",
    position: "",
    email: "",
    phone: "",
    address: "",
  };

  
export const customerFormSchema = z.object({
  code: z.string().min(1, "Mã khách hàng là bắt buộc"),
  inCharge: z.string().min(1, "Người phụ trách là bắt buộc"),
  type: z.string().min(1, "Phân loại khách hàng là bắt buộc"),
  name: z.string().min(1, "Tên khách hàng là bắt buộc"),
  taxCode: z.string().min(1, "Mã số thuế là bắt buộc"),
  businessLicenseDate: z.string().min(1, "Ngày cấp giấy phép KD là bắt buộc"),
  representative: z.string().min(1, "Người đại diện là bắt buộc"),
  position: z.string().min(1, "Chức vụ là bắt buộc"),
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  phone: z.string().min(1, "Số điện thoại là bắt buộc"),
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
});
