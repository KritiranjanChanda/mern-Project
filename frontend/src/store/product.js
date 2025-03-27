import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],

  setProducts: (products) => set({ products }),

  fetchProducts: async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const result = await res.json();

      console.log("Fetched Products:", result);

      if (result.success && Array.isArray(result.data)) {
        set({ products: result.data });
      } else {
        console.error("Invalid API response format", result);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  },

  createProduct: async (newProduct) => {
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      const data = await res.json();

      if (!data.success) {
        return { success: false, message: data.message };
      }

      set((state) => ({
        products: [...state.products, data.data],
      }));

      return { success: true, message: "Product added successfully!" };
    } catch (error) {
      console.error("Failed to create product:", error);
      return { success: false, message: "Error adding product" };
    }
  },

  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${pid}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        products: state.products.filter((product) => product._id !== pid),
      }));

      return { success: true, message: "Product deleted successfully!" };
    } catch (error) {
      console.error("Failed to delete product:", error);
      return { success: false, message: "Error deleting product" };
    }
  },

 updateProduct: async (pid, updatedProduct) => {
    const res = await fetch(`http://localhost:5000/api/products/${pid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });
    const data = await res.json();
    if (!data.success) {
      return { success: false, message: data.message };
    }

    set((state) => ({
      products: state.products.map((product) =>
        product._id === pid ? data.data : product
      ),


    }));

    return { success: true, message: data.message };
  },
}));


