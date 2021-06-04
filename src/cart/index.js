import express from "express"
import shopModel from "./schema.js"

const cartRouter = express.Router()

cartRouter.post("/add", async (req, res, next) => {
    try {
        const product = await shopModel(req.body)
        const shoppingcart = product.toObject()
        const check = await shopModel.findOne({
            product_id: shoppingcart.product_id
        })
        if (check) {
            await shopModel.findOneAndUpdate({ product_id: shoppingcart.product_id }, { $inc: { quantity: 1 } })
            res.send("updated")
        } else {
            const item = await product.save()
            console.log(item)
            res.send(item)
        }
    } catch (error) {
        console.log(error)
		next(error)
    }
})

cartRouter.post("/remove", async (req, res, next) => {
    try {
        const product = await shopModel(req.body)
        const shoppingcart = product.toObject()
        const check = await shopModel.findOne({
            product_id: shoppingcart.product_id
        })
        if (check && check.quantity > 1) {
            await shopModel.findOneAndUpdate(
                { product_id: shoppingcart.product_id },
                { $inc: { quantity: -1 } },
                { new: true }
            )
            res.send("updated")
        } else if (check && check.quantity === 1) {
            await shopModel.findByIdAndDelete(req.body.product_id)
            res.send("product removed")
        } else {
            res.send("product does not exist")
        }
    } catch (error) {
        console.log(error)
		next(error)
    }
})

cartRouter.get("/", async (req, res, next) => {
    try {
        const shoppingcart = await shopModel.find().populate("product_id")
        res.send(shoppingcart)
    } catch (error) {
        console.log(error)
    }
})

export default cartRouter
