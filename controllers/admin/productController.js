const mongoose = require("mongoose");
const Product = require("../models/productModel");
const ProductImage = require("../models/productImageModel");
const Category = require("../models/categoryModel");
const sendResponse = require("../utils/responseHelper");
const cloudinary = require("cloudinary").v2;
const {
  validateImageFile,
  uploadToCloudinary,
} = require("../../utils/cloudinary/uploadHelpers");

/**
 * @desc    Create a new product with main image and optional additional images
 * @route   POST /api/products
 * @access  Private/Admin
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body;

    // Validate required fields

    // Check if category exists
    const categoryExists = await Category.findById(category_id);
    if (!categoryExists) {
      return sendResponse(res, 404, false, "Category not found");
    }

    // Validate and upload main image
    if (!req.files || !req.files.mainImage) {
      return sendResponse(res, 400, false, "Main image is required");
    }

    const mainImage = req.files.mainImage[0];
    const validation = validateImageFile(mainImage);
    if (!validation.success) {
      return sendResponse(res, 400, false, validation.message);
    }

    // Upload main image to Cloudinary
    const mainImageResult = await uploadToCloudinary(
      mainImage,
      "products/main"
    );

    // Create the product
    const product = new Product({
      name,
      description,
      price,
      stock,
      category_id,
      image_url: mainImageResult.secure_url,
    });

    const savedProduct = await product.save();

    // Handle additional images if provided
    if (req.files.additionalImages && req.files.additionalImages.length > 0) {
      const additionalImages = req.files.additionalImages;
      const imageUploadPromises = additionalImages.map(async (image) => {
        const validation = validateImageFile(image);
        if (!validation.success) {
          return null;
        }

        const result = await uploadToCloudinary(image, "products/additional");
        return new ProductImage({
          product_id: savedProduct._id,
          url: result.secure_url,
          alt_text: `${name} - Product Image`,
        });
      });

      const productImages = await Promise.all(imageUploadPromises);
      const filteredImages = productImages.filter((img) => img !== null);
      await ProductImage.insertMany(filteredImages);
    }

    // Fetch the product with all its images
    const productWithImages = await Product.findById(savedProduct._id)
      .populate("category_id")
      .lean();
    const additionalImages = await ProductImage.find({
      product_id: savedProduct._id,
    });

    return sendResponse(res, 201, true, "Product created successfully", {
      ...productWithImages,
      additional_images: additionalImages,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return sendResponse(res, 500, false, "Server error while creating product");
  }
};

/**
 * @desc    Update product details
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category_id } = req.body;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid product ID");
    }

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return sendResponse(res, 404, false, "Product not found");
    }

    // Check if category exists if it's being updated
    if (category_id) {
      const categoryExists = await Category.findById(category_id);
      if (!categoryExists) {
        return sendResponse(res, 404, false, "Category not found");
      }
    }

    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category_id = category_id || product.category_id;

    // Handle main image update if provided
    if (req.files && req.files.mainImage) {
      const mainImage = req.files.mainImage[0];
      const validation = validateImageFile(mainImage);
      if (!validation.success) {
        return sendResponse(res, 400, false, validation.message);
      }

      // Upload new main image to Cloudinary
      const mainImageResult = await uploadToCloudinary(
        mainImage,
        "products/main"
      );
      product.image_url = mainImageResult.secure_url;
    }

    const updatedProduct = await product.save();

    return sendResponse(
      res,
      200,
      true,
      "Product updated successfully",
      updatedProduct
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return sendResponse(res, 500, false, "Server error while updating product");
  }
};

/**
 * @desc    Soft delete (archive) a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid product ID");
    }

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return sendResponse(res, 404, false, "Product not found");
    }

    // Soft delete by setting isArchived flag
    product.isArchived = true;
    await product.save();

    return sendResponse(res, 200, true, "Product archived successfully", {
      productId: id,
    });
  } catch (error) {
    console.error("Error archiving product:", error);
    return sendResponse(
      res,
      500,
      false,
      "Server error while archiving product"
    );
  }
};

/**
 * @desc    Add additional images to an existing product
 * @route   POST /api/products/:id/images
 * @access  Private/Admin
 */
exports.addProductImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid product ID");
    }

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return sendResponse(res, 404, false, "Product not found");
    }

    // Check if images were provided
    if (!req.files || req.files.length === 0) {
      return sendResponse(res, 400, false, "No images provided");
    }

    // Process each image
    const imageUploadPromises = req.files.map(async (image) => {
      const validation = validateImageFile(image);
      if (!validation.success) {
        return null;
      }

      const result = await uploadToCloudinary(image, "products/additional");
      return new ProductImage({
        product_id: id,
        url: result.secure_url,
        alt_text: `${product.name} - Product Image`,
      });
    });

    const productImages = await Promise.all(imageUploadPromises);
    const filteredImages = productImages.filter((img) => img !== null);

    if (filteredImages.length === 0) {
      return sendResponse(res, 400, false, "No valid images provided");
    }

    await ProductImage.insertMany(filteredImages);

    return sendResponse(res, 201, true, "Images added successfully", {
      count: filteredImages.length,
    });
  } catch (error) {
    console.error("Error adding product images:", error);
    return sendResponse(
      res,
      500,
      false,
      "Server error while adding product images"
    );
  }
};

/**
 * @desc    Delete a specific product image
 * @route   DELETE /api/products/images/:imageId
 * @access  Private/Admin
 */
exports.deleteProductImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    // Validate image ID
    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      return sendResponse(res, 400, false, "Invalid image ID");
    }

    // Find and delete the image
    const image = await ProductImage.findByIdAndDelete(imageId);
    if (!image) {
      return sendResponse(res, 404, false, "Image not found");
    }

    // Extract public ID from Cloudinary URL for deletion
    const urlParts = image.url.split("/");
    const publicIdWithExtension = urlParts.slice(-2).join("/").split(".")[0];
    const publicId = `products/additional/${publicIdWithExtension
      .split("/")
      .pop()}`;

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    return sendResponse(res, 200, true, "Image deleted successfully", {
      imageId,
    });
  } catch (error) {
    console.error("Error deleting product image:", error);
    return sendResponse(
      res,
      500,
      false,
      "Server error while deleting product image"
    );
  }
};
