import express from "express"
import cors from "cors"
import uniqid from "uniqid"
import fs from "fs-extra"
import listEndpoints from "express-list-endpoints"
import productRoutes from "./products/products.js"
import reviewRoutes from "./reviews/review.js"
import { badRequestErrorHandler, forbiddenErrorHandler, notFoundErrorHandler, catchAllErrorHandler } from "./helpers/errorHandlers.js"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const server = express()
const port = 3001

const publicFolder = join(dirname(fileURLToPath(import.meta.url)), "../public/")

server.use(cors())
server.use(express.json())
server.use(express.static(publicFolder))

const logger = async (req, res, next) => {
    const content = await fs.readJSON(join(dirname(fileURLToPath(import.meta.url)), "log.json"))
    content.push({
        _timeStamp: new Date(),
        method: req.method,
        resource: req.url,
        query: req.query,
        body: req.body,
        _id: uniqid()
    })

    await fs.writeJSON(join(dirname(fileURLToPath(import.meta.url)), "log.json"), content)
    next()
}

server.use(logger)

server.use("/products", productRoutes)
server.use("/reviews", reviewRoutes)

server.use(badRequestErrorHandler)
server.use(forbiddenErrorHandler)
server.use(notFoundErrorHandler)
server.use(catchAllErrorHandler)

server.listen(port, () => {
    console.log("server running on port: ", port)
})

console.table(listEndpoints(server))
