import express, { Request, Response } from "express" 
import { request } from "http";
import routeAdmin from "./route/adminRoute"
import routeCar from "./route/carRoute"
import routeRent from "./route/rentRoute"

const app = express()

const PORT = 7000
app.use(express.json())

app.use(routeAdmin)
app.use(routeCar)
app.use(routeRent)

/* run sever*/
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})