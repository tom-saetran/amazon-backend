import express from "express"
import multer from "multer"
import { getProducts, writeProducts, writeProductImages } from "../helpers/files.js"
import { productValidation } from "./validation.js"
import  createError  from "http-errors"
import { validationResult } from "express-validator"
import uniqid from "uniqid"

const productsRouter = express.Router()

productsRouter.get("/", async (req, res, next) => {
    try {
        const products = await getProducts()

        if (req.query.name) {
            const filteredProducts = products.filter(products => products.name.toLowerCase().includes(req.query.name.toLowerCase()))

            filteredProducts.length > 0 ? res.status(200).send(filteredProducts) : next(createError(404, `No products with title: ${req.query.name}`))
        } else {
            products.length > 0 ? res.send(products) : next(createError(404, "No products available!"))
        }
    }
    catch (error) {
        next(error)
    }

})

productsRouter.get("/:id", async (req, res, next) => {
    try {
        const products = await getProducts()
        const product = products.find(product => product._id === req.params.id)
        product ? res.status(200).send(product) : next(createError(404, "Product not found, check your ID and try again!"))
    } catch (error) {
        next(error)
    }
})

productsRouter.post("/", productValidation, async (req, res, next) => {
    try {
        const products = await getProducts()
        const errors = validationResult(req)

        if (errors.isEmpty()) {
            const product = { ...req.body, _id: uniqid(), createdOn: new Date() }
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
        const errors = validationResult(req)

        if (errors.isEmpty()) {
            const product = products.find((product) => product._id === req.params.id)
            const filtered = products.filter(product => product._id !== req.params.id)
            const updatedproduct = { ...req.body, createdOn: product.createdOn, _id: product._id, lastUpdatedOn: new Date() }
            filtered.push(updatedproduct)
            await writeProducts(filtered)
            res.status(200).send(updatedproduct)
        } else {
            next(createError(400, errors))
        }
    } catch (error) {
        next(error)
    }

})

productsRouter.delete("/:id", async (req, res, next) => {
    try {
        const products = await getProducts()
        const newProducts = products.filter(product => product._id !== req.params.id)
        await writeProducts(newProducts)

        res.send(newProducts)
    } catch (error) {
        next(error)
    }
})

productsRouter.post("/:id/uploadImage", multer().array("productImages"), async (req, res, next) => {

    try {
        console.log(req.files[0])
        const products = await getProducts()
        const filteredProducts = products.filter(product => product._id !== req.params.id)

        await writeProductImages(req.params.id + ".jpg", req.files[0].buffer)

        const product = products.find(product => product._id === req.params.id)

        product.image = `http://localhost:3001/images/productImages/${req.params.id}.jpg`
        filteredProducts.push(product)

        writeProducts(filteredProducts)
        res.status(200).send("Image uploaded successfully")
    } catch (error) {
        next(error)
    }

})

productsRouter.get("/:id/reviews", async (req, res, next) => {

    try {
        
    } catch (error) {
        next(error)
    }
})
export default productsRouter