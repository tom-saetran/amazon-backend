import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile } = fs

const productImagesFolder = join(dirname(fileURLToPath(import.meta.url)), "../../public/images/productImages")
const productsFile = join(dirname(fileURLToPath(import.meta.url)), "../products/products.json")

export const getProducts = async () => await readJSON(productsFile)
export const writeProducts = async content => await writeJSON(productsFile, content)

const reviewsFile = join(dirname(fileURLToPath(import.meta.url)), "../reviews/reviews.json")

export const getReviews = async () => await readJSON(reviewsFile)
export const writeReviews = async content => await writeJSON(reviewsFile, content)

export const writeProductImages = async (fileName, content) => await writeFile(join(productImagesFolder, fileName), content)
