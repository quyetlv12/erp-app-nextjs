import z from "zod";
export type ImportFormData = z.infer<typeof importFormSchema>;

export const defaultForm: ImportFormData = {
    formName: '',
    file: undefined as any,
  };
export const importFormSchema = z.object({
    formName: z.string().min(1, 'Tên biểu mẫu là bắt buộc'),
    file: z.any().refine((val) => val?.length > 0, {
      message: 'Bạn cần chọn 1 file',
    }),
  });