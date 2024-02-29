import express from "express"
import { createRent, deleteRent, readRent, updateRent } from "../controller/rent"
const app = express()

/**allow to read a json from body */
app.use(express.json())

/**adress for get event data */
app.get(`/rent`, readRent)
app.post(`/rent`,createRent)
app.put(`/rent/:rentID`,updateRent)
app.delete(`/rent/:rentID`,deleteRent)


export default app  