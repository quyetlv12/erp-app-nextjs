export interface CustomerFormData {
    _id?: any;
    code: string;
    inCharge: string;
    type: string;
    name: string;
    taxCode: string;
    businessLicenseDate: string;
    representative: string;
    position: string;
    email: string;
    phone: string;
    address: string;
    createdBy?: string;
    createdAt?: string;
}
export interface FormData {
    name: string,
    placeholders: [],
    file: any,
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface LoginResData {
    email :string;
    name : string;
}