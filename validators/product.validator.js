const { body } = require('express-validator');

exports.createProductValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),

  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('category_id')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),
];
exports.updateProductValidator = [
  body('name')
    .optional()
    .isString().withMessage('Name must be a string'),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),

  body('price')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('category_id')
    .optional()
    .isMongoId().withMessage('Invalid category ID'),
];
exports.deleteProductValidator = [
  body('product_id')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID'),
];
