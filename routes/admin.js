const express = require("express");
const router = express.Router();
const productController = require("../../controllers/admin/productController");
const { createProductValidator, updateProductValidator } = require("../../validators/product.validator");
const upload = require("../../middlewares/multer.middleware");

// Create product
router.post("/products", upload.fields([{ name: "mainImage", maxCount: 1 }, { name: "additionalImages", maxCount: 5 }]), createProductValidator, productController.createProduct);
router.put("/products/:id", upload.fields([{ name: "mainImage", maxCount: 1 }]), updateProductValidator, productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);
router.post("/products/:id/images", upload.array("images", 5), productController.addProductImage);
router.delete("/products/images/:imageId", productController.deleteProductImage);

module.exports = router;
