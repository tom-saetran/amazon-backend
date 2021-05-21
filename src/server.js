import express from "express"
import cors from "cors"
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
