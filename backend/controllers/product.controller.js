import Product from '../models/product.model.js';
import mongoose from "mongoose";


export const getProducts = async (req, res) => {    
    try {
        const products = await Product.find();
        res.status(200).json({success: true, data: products});
    } catch (error) {
        res.status(500).json({success: false, message: "Server Error"});
    }
};

export const createProduct = async (req, res) => {
    const products = req.body; //user will send this data
    
    if (!products.name || !products.price || !products.image) {
            return res.status(400).json({success: false, message: "Please provide all fields" });
    }
    
    const product = new Product(products);
        
        try {
            await product.save();
            res.status(201).json({success: true, data: product});
        } catch (error) {
          console.error("Error in Create product", error.message);
            res.status(500).json({success: false, message: "Server Error"});
    
            
        }
    
};

export const updateProduct =  async(req, res) => {
    const {id} = req.params;
    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No product with that id");
    }
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, {new: true});
        res.status(200).json({success: true, data: updatedProduct});
    } catch (error) {
      res.status(500).json({success: false, message: "Product not found"});
        
    }
};

export const deleteProduct = async(req, res) => {
    const {id} = req.params;
    
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "Product deleted successfully"});
    } catch (error) {
      console.log("Error in deleting product", error.message);  
      res.status(500).json({success: false, message: "Server Error"});  
    }
}