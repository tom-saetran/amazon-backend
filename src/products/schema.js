import mongoose from "mongoose"
import createError from "http-errors"

const { Schema, model } = mongoose

const ProductSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        brand: { type: String, required: true },
        imageUrl: { type: String },
        price: { type: Number, required: true },
        reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }]
    },
    { timestamps: true }
)

ProductSchema.post("validate", (error, doc, next) => {
    if (error) {
        const err = createError(400, error)
        next(err)
    } else {
        next()
    }
})

ProductSchema.static("findproduct", async function (id) {
    const product = await this.findOne({ _id: id }).populate("reviews")
    console.log(product)
    return product
})

ProductSchema.static("getreviews", async function (id) {
    const reviews = await this.findById(id, { reviews: 1 }).populate("reviews")
    return reviews
})

export default model("Product", ProductSchema)
