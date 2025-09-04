import { create } from 'zustand';
import { Product } from '@/types/product';
import { MOCK_PRODUCTS } from '@/lib/mockData';

interface ProductStore {
  products: Product[];
  popularProducts: Product[];
  newProducts: Product[];
  getProductById: (id: string) => Product | undefined;
  getProductsByBrand: (brand: string) => Product[];
  searchProducts: (query: string) => Product[];
  filterProducts: (filters: ProductFilters) => Product[];
}

interface ProductFilters {
  brands?: string[];
  flavors?: string[];
  priceRange?: [number, number];
  nicotine?: string[];
  inStock?: boolean;
}

export const useProductStore = create<ProductStore>()((set, get) => ({
  products: MOCK_PRODUCTS,

  popularProducts: MOCK_PRODUCTS.filter((product) => product.isPopular),

  newProducts: MOCK_PRODUCTS.filter((product) => product.isNew),

  getProductById: (id: string) => {
    const { products } = get();
    return products.find((product) => product.id === id);
  },

  getProductsByBrand: (brand: string) => {
    const { products } = get();
    return products.filter((product) =>
      product.brand.toLowerCase().includes(brand.toLowerCase())
    );
  },

  searchProducts: (query: string) => {
    const { products } = get();
    const lowercaseQuery = query.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.brand.toLowerCase().includes(lowercaseQuery) ||
        product.flavor.toLowerCase().includes(lowercaseQuery)
    );
  },

  filterProducts: (filters: ProductFilters) => {
    const { products } = get();
    let filtered = [...products];

    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.brands!.includes(product.brand)
      );
    }

    if (filters.flavors && filters.flavors.length > 0) {
      filtered = filtered.filter((product) =>
        filters.flavors!.some((flavor) =>
          product.flavor.toLowerCase().includes(flavor.toLowerCase())
        )
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(
        (product) => product.price >= min && product.price <= max
      );
    }

    if (filters.nicotine && filters.nicotine.length > 0) {
      filtered = filtered.filter((product) =>
        filters.nicotine!.includes(product.nicotine)
      );
    }

    if (filters.inStock) {
      filtered = filtered.filter((product) => product.inStock);
    }

    return filtered;
  },
}));

export type { ProductFilters };
