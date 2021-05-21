import express from "express"
import multer from "multer"
import { getProducts, writeProducts, writeProductImages } from "../helpers/files.js"
import { productValidation } from "../helpers/validation.js"
import createError from "http-errors"
import { validationResult } from "express-validator"
import uniqid from "uniqid"
import path from "path"

const productsRouter = express.Router()

productsRouter.get("/", async (req, res, next) => {
    try {
        const products = await getProducts()
        if (req.query.category) {
            // ?category=filtered
            const filteredProducts = products.filter(products => products.category.toLowerCase().includes(req.query.category.toLowerCase()))
            filteredProducts.length > 0 ? res.status(200).send(filteredProducts) : next(createError(404, `No products with category: ${req.query.category}`))
        }
        if (req.query.name) {
            // ?name=filtered
            const filteredProducts = products.filter(products => products.name.toLowerCase().includes(req.query.name.toLowerCase()))
            filteredProducts.length > 0 ? res.status(200).send(filteredProducts) : next(createError(404, `No products with title: ${req.query.name}`))
        } else {
            products.length > 0 ? res.send(products) : next(createError(404, "No products available!"))
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.get("/:id", async (req, res, next) => {
    try {
        const products = await getProducts()
        const result = products.find(product => product._id === req.params.id)
        result ? res.status(200).send(result) : next(createError(404, "Product not found, check your ID and try again!"))
    } catch (error) {
        next(error)
    }
})

productsRouter.post("/", productValidation, async (req, res, next) => {
    try {
        const products = await getProducts()
        const errors = validationResult(req)

        if (errors.isEmpty()) {
            const product = { ...req.body, _id: uniqid(), createdOn: new Date(), reviews: [] }
            products.push(product)
            await writeProducts(products)
            res.status(201).send(product)
        } else {
            next(createError(400, errors))
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.put("/:id", productValidation, async (req, res, next) => {
    try {
        const products = await getProducts()
        const result = products.filter(product => product._id !== req.params.id)
        let me = products.find(product => product._id === req.params.id)
        if (!me) next(createError(400, "id not found"))
        else {
            me = { ...me, ...req.body, lastUpdatedOn: new Date() }
            const errors = validationResult(me)
            if (errors.isEmpty()) {
                result.push(me)
                await writeProducts(result)
                res.status(200).send(me)
            } else {
                next(createError(400, errors))
            }
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.delete("/:id", async (req, res, next) => {
    try {
        const products = await getProducts()
        const result = products.filter(product => product._id !== req.params.id)
        if (!result) next(createError(400, "id does not match"))
        else {
            await writeProducts(result)
            res.send("Deleted")
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.post("/:id/uploadImage", multer().single("productImage"), async (req, res, next) => {
    try {
        if (!req.file) next(createError(400, "What file exactly?"))
        else {
            const products = await getProducts()
            const result = products.filter(product => product._id !== req.params.id)
            if (!result) next(createError(400, "id does not match"))
            else {
                await writeProductImages(req.params.id + path.extname(req.file.originalname), req.file.buffer)
                const product = products.find(product => product._id === req.params.id)
                product.image = `${req.protocol}://${req.get("host")}/images/productImages/${req.params.id}${path.extname(req.file.originalname)}`
                result.push(product)
                writeProducts(result)
                res.status(200).send("Image uploaded successfully")
            }
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.get("/:id/reviews", async (req, res, next) => {
    try {
        const products = await getProducts()
        const result = products.find(product => product._id === req.params.id)
        result ? res.status(200).send(result.reviews) : next(createError(404, "id does not match"))
    } catch (error) {
        next(error)
    }
})
export default productsRouter
