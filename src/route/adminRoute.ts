import express from "express"
import { verifyAdmin } from "../middleware/verifyAdmin"
import { createAdmin, deleteAdmin, readAdmin, updateAdmin,login } from "../controller/admin"
const app = express()

/**allow to read a json from body */
app.use(express.json())

/**adress for get event data */
app.get(`/admin`, readAdmin)
app.post(`/admin`, createAdmin)
app.put(`/admin/:adminID`, updateAdmin)
app.delete(`/admin/:adminID`, deleteAdmin)
app.post(`/admin/login`, login)


export default app  