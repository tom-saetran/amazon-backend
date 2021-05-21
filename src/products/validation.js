import { body } from "express-validator"

export const productValidation = [
    body("name").exists().withMessage("title is a mandatory field!")
]

export const reviewValidation = [
    body("comment").exists().withMessage("comment is a mandatory field!")
]