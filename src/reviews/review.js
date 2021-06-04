import express from "express"
import multer from "multer"
import { getProducts, writeProducts, writeProductImages, getReviews, writeReviews } from "../helpers/files.js"
import { reviewValidation } from "../helpers/validation.js"
import createError from "http-errors"
import { validationResult } from "express-validator"
import uniqid from "uniqid"
import { write } from "fs-extra"
import ReviewModel from "./schema.js"

const reviewsRouter = express.Router()

reviewsRouter.get("/", async (req, res, next) => {
    try {
        const reviews = await getReviews()
        reviews.length > 0 ? res.send(reviews) : next(createError(404, "No reviews available!"))
    } catch (error) {
        next(error)
    }
})

reviewsRouter.get("/:id", async (req, res, next) => {
    try {
        const reviews = await getReviews()
        const result = reviews.find(review => review._id === req.params.id)
        result ? res.status(200).send(result) : next(createError(404, "review not found, check your ID and try again!"))
    } catch (error) {
        next(error)
    }
})

reviewsRouter.post("/", reviewValidation, async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            const reviews = await getReviews()
            const review = { ...req.body, _id: uniqid(), createdOn: new Date() }
            reviews.push(review)

            const products = await getProducts()
            const product = products.find(product => product._id === review.productId)
            if (!product) next(createError(400, "provided product id does not match"))
            else {
                const filteredProducts = products.filter(product => product._id !== review.productId)
                product.reviews.push(review)
                filteredProducts.push(product)
                await writeReviews(reviews)
                await writeProducts(filteredProducts)
                res.status(201).send(review)
            }
        } else {
            next(createError(400, errors))
        }
    } catch (error) {
        next(error)
    }
})

reviewsRouter.put("/:id", async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            const reviews = await getReviews()
            let review = reviews.find(review => review._id === req.params.id)
            if (!review) next(createError(400, "id does not match"))
            else {
                const filtered = reviews.filter(review => review._id !== req.params.id)
                review = { ...review, ...req.body, lastUpdatedOn: new Date() }
                filtered.push(review)
                await writeReviews(filtered)
                res.status(200).send(review)
            }
        } else {
            next(createError(400, errors))
        }
    } catch (error) {
        next(error)
    }
})

reviewsRouter.delete("/:id", async (req, res, next) => {
    try {
        const reviews = await getReviews()
        const result = reviews.filter(review => review._id !== req.params.id)
        if (!result) next(createError(400, "id does not match"))
        else {
            await writeReviews(result)
            res.send(result)
        }
    } catch (error) {
        next(error)
    }
})

export default reviewsRouter
