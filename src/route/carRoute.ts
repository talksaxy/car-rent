import express from "express"
import { verifyAdmin } from "../middleware/verifyAdmin"
import { createCar, deleteCar, readCar, updateCar } from "../controller/car"
const app = express()

/**allow to read a json from body */
app.use(express.json())

/**adress for get event data */
app.get(`/car`,readCar)
app.post(`/car`, createCar)
app.put(`/car/:carID`, updateCar)
app.delete(`/car/:carID`, deleteCar)


export default app  