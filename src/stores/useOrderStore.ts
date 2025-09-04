import { create } from 'zustand';
import { Order } from '@/types/order';
import { MOCK_ORDERS } from '@/lib/mockData';

interface OrderStore {
  orders: Order[];
  getOrdersByUserId: (userId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useOrderStore = create<OrderStore>()((set, get) => ({
  orders: MOCK_ORDERS,

  getOrdersByUserId: (userId: string) => {
    const { orders } = get();
    return orders.filter((order) => order.userId === userId);
  },

  getOrderById: (orderId: string) => {
    const { orders } = get();
    return orders.find((order) => order.id === orderId);
  },

  addOrder: (order: Order) => {
    set((state) => ({
      orders: [order, ...state.orders],
    }));
  },

  updateOrderStatus: (orderId: string, status: Order['status']) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    }));
  },
}));
