import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useProductsStore = create(
  persist(
    (set, get) => ({
      products: [],
      
      setProducts: (productsData) => 
        set({
          products: productsData.map((product) => ({
            id: product.id,
            productName: product.productName,
            description: product.description,
            images: product.images,
            featureList: product.featureList,
            bidPrice: product.bidPrice,
            marketPrice: product.marketPrice,
            productCode: product.productCode,
            isActive: product.isActive,
            isDeleted: product.isDeleted,
            expiryDate: product.expiryDate,
            addedBy: product.addedBy,
            addedOn: product.addedOn,
            updatedBy: product.updatedBy,
            deletedBy: product.deletedBy,
            deletedOn: product.deletedOn,
            updatedOn: product.updatedOn
          })),
        }),

      clearProducts: () =>
        set({
          products: []
        }),
    }),
    {
      name: "products-storage",
      getStorage: () => localStorage,
    }
  )
);
