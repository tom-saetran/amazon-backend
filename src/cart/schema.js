import mongoose from "mongoose"

const { Schema, model } = mongoose

const shopSchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1 }
})

export default model("Cart", shopSchema)
