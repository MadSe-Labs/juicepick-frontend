import { CartItem } from './cart';

export type StatusTypes =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: StatusTypes;
  orderDate: string;
  deliveryDate?: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    detailAddress: string;
    zipCode: string;
  };
}
