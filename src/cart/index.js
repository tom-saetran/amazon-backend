import express from "express"
import shopModel from "./schema.js"

const shoppingRouter = express.Router()

cartRouter.post("/add", async (req, res, next) => {
    try {
        const shoppingcart = await shopModel(req.body)
        const check = await shopModel.findById(req.body._id)
        if (check) {
            await shopModel.findOneAndUpdate({ _id: req.body._id }, { $inc: { quantity: 1 } })
            res.send("updated")
        } else {
            const item = await shoppingcart.save()
            console.log(item)
            res.send(item)
        }
    } catch (error) {
        console.log(error)
    }
})

cartRouter.post("/remove", async (req, res, next) => {
    try {
        const check = await shopModel.findById(req.body._id)
        if (check && check.quantity > 1) {
            await shopModel.findOneAndUpdate({ _id: req.body._id }, { $inc: { quantity: -1 } }, { new: true })
            res.send("updated")
        } else if (check && check.quantity === 1) {
            await shopModel.findByIdAndDelete(req.body._id)
            res.send("product removed")
        }
    } catch (error) {
        console.log(error)
    }
})

cartRouter.get("/cart", async (req, res, next) => {
    try {
        const shoppingcart = await shopModel.find().populate("product")
        res.send(shoppingcart)
    } catch (error) {
        console.log(error)
    }
})

export default cartRouter
