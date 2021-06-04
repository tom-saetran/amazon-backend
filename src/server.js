import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import productRoutes from "./products/products.js"
import reviewRoutes from "./reviews/review.js"
import cartRoutes from "./cart/index.js"
import {
    badRequestErrorHandler,
    forbiddenErrorHandler,
    notFoundErrorHandler,
    catchAllErrorHandler
} from "./helpers/errorHandlers.js"

import logModel from "./schema/log.js"
import mongoose from "mongoose"
import createError from "http-errors"

const server = express()
const port = process.env.PORT || 3001

const whitelist = [process.env.FRONTEND_DEV_URL, process.env.FRONTEND_PROD_URL, "bypass"]
const corsOptions = {
    origin: (origin, next) => {
        try {
            if (whitelist.indexOf(origin) !== -1) {
                next(null, true)
            } else {
                next(createError(400, "Cross-Site Origin Policy blocked your request"), true)
            }
        } catch (error) {
            next(error)
        }
    }
}

//server.use(cors(corsOptions))
server.use(cors())

server.use(express.json())

// ##### Global Middleware #####
const logger = async (req, res, next) => {
    try {
        const entry = new logModel({
            method: req.method,
            query: req.query,
            params: req.params,
            body: req.body
        })
        await entry.save()
        next()
    } catch (error) {
        next(error)
    }
}
server.use(logger)

server.use("/products", productRoutes)
server.use("/reviews", reviewRoutes)
server.use("/cart", cartRoutes)

server.use(badRequestErrorHandler)
server.use(forbiddenErrorHandler)
server.use(notFoundErrorHandler)
server.use(catchAllErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    server.listen(port, () => {
        console.table(listEndpoints(server))
        console.log("server is running on port: ", port)
    })
})
