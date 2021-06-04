import mongoose from "mongoose"
import createError from "http-errors"

const { Schema, model } = mongoose

const ReviewSchema = new Schema(
    {
        rate: { type: Number, min: 0, max: 5, required: true },
        comment: { type: String, required: true }
    },
    { timestamps: true }
)

ReviewSchema.post("validate", (error, doc, next) => {
    if (error) {
        const err = createError(400, error)
        next(err)
    } else {
        next()
    }
})

export default model("Review", ReviewSchema)
