import express from "express"
import createError from "http-errors"
import ProductModel from "./schema.js"
import q2m from "query-to-mongo"

const productRouter = express.Router()

//Get All Products
productRouter.get("/", async (req, res, next) => {
    try {
        const query = q2m(req.query)
        const total = await ProductModel.countDocuments(query.criteria)
        const limit = 5
        const result = await ProductModel.find(query.criteria)
            .sort(query.options.sort)
            .skip(query.options.skip || 0)
            .limit(query.options.limit && query.options.limit < limit ? query.options.limit : limit)
            .populate("reviews")
        res.status(200).send({ links: query.links("/reviews", total), total, result })
    } catch (error) {
        next(error)
    }
})

// Get product with ID
productRouter.get("/:id", async (req, res, next) => {
    try {
        const result = await ProductModel.findById(req.params.id).populate("reviews")
        if (!result) createError(400, "id not found")
        else res.status(200).send(result)
    } catch (error) {
        next(error)
    }
})

// Post new product
productRouter.post("/", async (req, res, next) => {
    try {
        const entry = req.body
        const product = new ProductModel(entry)
        const { _id } = await product.save()
        res.status(201).send(_id)
    } catch (error) {
        next(error)
    }
})

// Edit product with ID
productRouter.put("/:id", async (req, res, next) => {
    try {
        const result = await ProductModel.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { runValidators: true, new: true, useFindAndModify: false }
        )
        if (result) res.status(200).send(result)
        else createError(400, "ID not found")
    } catch (error) {
        next(error)
    }
})

// Delete product with ID
productRouter.delete("/:id", async (req, res, next) => {
    try {
        const result = await ProductModel.findByIdAndRemove(req.params.id, { useFindAndModify: false })
        if (result) res.status(200).send("Deleted")
        else createError(400, "ID not found")
    } catch (error) {
        next(error)
    }
})

export default productRouter
