import { body } from "express-validator"

export const productValidation = [
    body("name").exists().withMessage("Name is a mandatory field!"),
    body("description").exists().isLength({ min: 50 }).withMessage("Description is mandatorty and needs to be more than 50 characters!"),
    body("brand").exists().isLength({ max: 50 }).withMessage("Brand is a mandatory field!"),
    body("price").exists().isInt().withMessage("Price is a mandatory field and needs to be an integer!"),
    body("category").exists().withMessage("Category is a mandatory field!")
]

export const reviewValidation = [
    body("comment").exists().withMessage("comment is a mandatory field!"),
    body("rate").exists().isInt({min: 1, max: 5}).withMessage("Rate is a mandatory field and must be between 1-5!"),
    body("productId").exists().withMessage("ProductId is a mandatory field!")
]