import { create } from 'zustand';
import { CustomerFormData } from '@/interfaces';

interface CustomerState {
  customers: CustomerFormData[];
  selectedCustomer?: CustomerFormData | null;
  setCustomers: (data: CustomerFormData[]) => void;
  addCustomer: (newCustomer: CustomerFormData) => void;
  updateCustomer: (updated: CustomerFormData) => void;
  removeCustomer: (id: number) => void;
  selectCustomer: (customer?: CustomerFormData) => void;
  resetSelectCustomer: () => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  selectedCustomer: undefined,

  setCustomers: (data) => set({ customers: data }),

  addCustomer: (newCustomer) =>
    set((state) => ({
      customers: [...state.customers, newCustomer],
    })),

  updateCustomer: (updated) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c._id === updated._id ? updated : c
      ),
    })),

  removeCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c._id !== id),
    })),

  selectCustomer: (customer) => set({ selectedCustomer: customer }),


  resetSelectCustomer: () => set({ selectedCustomer: null }),

}));
