import mongoose from "mongoose"

const { Schema, model } = mongoose

const shopSchema = new Schema({
    product: String,
    quantity: { type: Number, default: 1 }
})

export default model("Cart", shopSchema)
