import { useState, useEffect } from 'react';
import type { Product } from '@/types/product';

export interface FilterOptions {
  selectedBrands: string[];
  selectedFlavors: string[];
  selectedNicotine: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
}

export const useProductFilter = (searchResults: Product[]) => {
  // 필터 상태
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedNicotine, setSelectedNicotine] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(searchResults);

  // 브랜드 필터 핸들러
  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    }
  };

  // 맛 필터 핸들러
  const handleFlavorChange = (flavor: string, checked: boolean) => {
    if (checked) {
      setSelectedFlavors([...selectedFlavors, flavor]);
    } else {
      setSelectedFlavors(selectedFlavors.filter((f) => f !== flavor));
    }
  };

  // 니코틴 필터 핸들러
  const handleNicotineChange = (nicotine: string, checked: boolean) => {
    if (checked) {
      setSelectedNicotine([...selectedNicotine, nicotine]);
    } else {
      setSelectedNicotine(selectedNicotine.filter((n) => n !== nicotine));
    }
  };

  // 필터 초기화
  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedFlavors([]);
    setSelectedNicotine([]);
    setPriceRange([0, 20000]);
    setInStockOnly(false);
  };

  // 필터 적용
  useEffect(() => {
    let result = searchResults;

    // 브랜드 필터
    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    // 맛 필터
    if (selectedFlavors.length > 0) {
      result = result.filter((product) =>
        selectedFlavors.some((flavor) =>
          product.flavor.toLowerCase().includes(flavor.toLowerCase())
        )
      );
    }

    // 니코틴 필터
    if (selectedNicotine.length > 0) {
      result = result.filter((product) =>
        selectedNicotine.includes(product.nicotine)
      );
    }

    // 가격 범위 필터 (기본값이 아닐 때만)
    if (priceRange[0] > 0 || priceRange[1] < 20000) {
      const [min, max] = priceRange;
      result = result.filter(
        (product) => product.price >= min && product.price <= max
      );
    }

    // 재고 필터
    if (inStockOnly) {
      result = result.filter((product) => product.inStock);
    }

    setFilteredProducts(result);
  }, [
    searchResults,
    selectedBrands,
    selectedFlavors,
    selectedNicotine,
    priceRange,
    inStockOnly,
  ]);

  return {
    // 필터된 결과
    filteredProducts,

    // 필터 상태
    filters: {
      selectedBrands,
      selectedFlavors,
      selectedNicotine,
      priceRange,
      inStockOnly,
    },

    // 필터 핸들러들
    handleBrandChange,
    handleFlavorChange,
    handleNicotineChange,
    setPriceRange,
    setInStockOnly,
    resetFilters,

    // 필터 활성 상태
    hasActiveFilters:
      selectedBrands.length > 0 ||
      selectedFlavors.length > 0 ||
      selectedNicotine.length > 0 ||
      priceRange[0] > 0 ||
      priceRange[1] < 20000 ||
      inStockOnly,
  };
};
