import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

const verifyAdmin = async (request: Request, response: Response, next: NextFunction) => {
    try {
        //membaca data header request
        const header = request.headers.authorization
        //membaca data token yang dikirimkan 
        const token = header?.split(" ")[1] || ''
        const secretkey = "sungchanku"
        //proses verifikasi token 
        verify(token, secretkey, error => {
            if (error) {
                return response.status(401).json({
                    status: false, message: "unautorized"
                })
            }
            next()
        })

    } catch (error) {
        return response
            .status(500)
            .json
            ({
                status: false,
                message: "error wir"
            })
    }
}

export { verifyAdmin }