import express from "express"
import multer from "multer"
import { getProducts, writeProducts, writeProductImages, getReviews, writeReviews } from "../helpers/files.js"
import { reviewValidation } from "../products/validation.js"
import createError from "http-errors"
import { validationResult } from "express-validator"
import uniqid from "uniqid"
import { write } from "fs-extra"

const reviewsRouter = express.Router()

reviewsRouter.get("/", async (req, res, next) => {
    try {
        const reviews = await getReviews()

        reviews.length > 0 ? res.send(reviews) : next(createError(404, "No reviews available!"))

    }
    catch (error) {
        next(error)
    }

})

reviewsRouter.get("/:id", async (req, res, next) => {
    try {
        const reviews = await getReviews()
        const review = reviews.find(review => review._id === req.params.id)
        review ? res.status(200).send(review) : next(createError(404, "review not found, check your ID and try again!"))
    } catch (error) {
        next(error)
    }
})

reviewsRouter.post("/", reviewValidation, async (req, res, next) => {
    try {
        const reviews = await getReviews()
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            const review = { ...req.body, _id: uniqid(), createdOn: new Date() }
            reviews.push(review)
            await writeReviews(reviews)
            res.status(201).send(review)
        } else {
            next(createError(400, errors))
        }
    } catch (error) {
        next(error)
    }

})

reviewsRouter.put("/:id", async (req, res, next) => {
    try {
        const reviews = await getReviews()
        const errors = validationResult(req)

        if (errors.isEmpty()) {
            const review = reviews.find((review) => review._id === req.params.id)
            const filtered = reviews.filter(review => review._id !== req.params.id)
            const updatedreview = { ...req.body, createdOn: review.createdOn, _id: review._id, lastUpdatedOn: new Date() }
            filtered.push(updatedreview)
            await writeReviews(filtered)
            res.status(200).send(updatedreview)
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
        const newReviews = reviews.filter(review => review._id !== req.params.id)
        await writeReviews(newReviews)

        res.send(newReviews)
    } catch (error) {
        next(error)
    }
})

// reviewsRouter.post("/:id/uploadImage", multer().array("productImages"), async (req, res, next) => {

//     try {
//         console.log(req.files[0])
//         const products = await getProducts()
//         const filteredProducts = products.filter(product => product._id !== req.params.id)

//         await writeProductImages(req.params.id + ".jpg", req.files[0].buffer)

//         const product = products.find(product => product._id === req.params.id)

//         product.image = `http://localhost:3001/images/productImages/${req.params.id}.jpg`
//         filteredProducts.push(product)

//         writeProducts(filteredProducts)
//         res.status(200).send("Image uploaded successfully")
//     } catch (error) {
//         next(error)
//     }

// })

export default reviewsRouter