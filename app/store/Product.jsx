import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useProductStore = create(
  persist(
    (set, get) => ({
      product: null,
      
      setProduct: (productData) => 
        set({
          product: {
            id: productData.id,
            productName: productData.productName,
            description: productData.description,
            images: productData.images,
            featureList: productData.featureList,
            bidPrice: productData.bidPrice,
            marketPrice: productData.marketPrice,
            productCode: productData.productCode,
            isActive: productData.isActive,
            isDeleted: productData.isDeleted,
            expiryDate: productData.expiryDate,
            addedBy: productData.addedBy,
            addedOn: productData.addedOn,
            updatedBy: productData.updatedBy,
            deletedBy: productData.deletedBy,
            deletedOn: productData.deletedOn,
            updatedOn: productData.updatedOn
          },
        }),

      clearProduct: () =>
        set({
          product: null
        }),
    }),
    {
      name: "product-storage",
      getStorage: () => localStorage,
    }
  )
);