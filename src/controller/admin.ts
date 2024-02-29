import { sign } from "jsonwebtoken"
import { PrismaClient } from "../../node_modules/.prisma/client/index"
import { Request, Response } from "express"
import md5 from "md5"

const prisma: PrismaClient = new PrismaClient()

const createAdmin = async (request: Request, response: Response) => {
    try {
        const adminName = request.body.adminName
        const email = request.body.email
        const password = md5(request.body.password)

        const newData = await prisma.admin.create({
            data: {
                adminName,
                email,
                password
            }
        })

        return response
            .status(200)
            .json({
                status: true,
                message: `New Admin has been created`,
                data: newData
            })
    } catch (error) {
        return response
            .status(500)
            .json({
                status: false,
                message: error
            })
    }
}

const readAdmin = async (request: Request, response: Response) => {
    try {
        const page = Number(request.query.page) || 1;
        const qty = Number (request.query.qty) || 10;
        const keyword = request.query.keyword?.toString() || "";
        const dataAdmin = await prisma.admin.findMany({
            take: qty, //mendefinisikan data yang diambil
            skip: (page - 1) * qty,
            where: {
                OR: [
                    {adminName: {contains: keyword}},
                ]
            },
            orderBy: {adminName: "asc"}
        })
        return response
            .status(200)
            .json({
                status: true,
                message: `Admin has been loaded`,
                data: dataAdmin
            })

    } catch (error) {
        return response
            .status(500)
            .json({
                status: false,
                message: error
            })
    }
}

const updateAdmin = async (request: Request, response: Response) => {
    try {
        const adminID = request.params.adminID
        const adminName = request.body.adminName
        const email = request.body.email
        const password = md5(request.body.password)

        /** make sure datanya sudah ada */
        const findAdmin = await prisma.admin.findFirst({
            where: { adminID: Number(adminID)}
        })

        /**give a response when event not found */
        if (!findAdmin) {
            return response.status(400)
                .json({
                    status: false,
                    message: `Data Admin not found`
                })
        }

        const updateAdmin = await prisma.admin.update({
            where: { adminID: Number(adminID) },
            data: {
                adminName: adminName || findAdmin.adminName,
                email: email || findAdmin.email,
                password: password || findAdmin.password
            }
        })

        return response.status(200)
            .json({
                status: true,
                message: `Admin has been updated`,
                data: updateAdmin
            })

    } catch (error) {
        return response
            .status(500)
            .json({
                status: false,
                message: error
            })
    }
}

const deleteAdmin = async (request: Request, response: Response) => {
    try {
        const adminID = Number(request.params.adminID) 

        /** make sure that event is exist*/
        const findAdmin = await prisma.admin.findFirst({
            where: { adminID: Number(adminID) } 
        })

        if (!findAdmin) {
            return response.status(400)
                .json({
                    status: false,
                    message: `Admin not found`
                })
        }

        /** execute for delete event */
        const deleteAdmin = await prisma.admin.delete({
            where: { adminID: Number(adminID) }
        })

        return response.status(200)
            .json({
                status: true,
                message: `Data Admin has been deleted`
            })
    } catch (error) {
        return response
            .status(500)
            .json({
                status: false,
                message: error
            })
    }
}

const login = async (request: Request, response: Response) => {
    try {
        const email = request.body.email
        const password = md5(request.body.password)
        
        const admin = await prisma.admin.findFirst(
            {
                where: { email: email, password: password }
            }
        )
        if (admin) {
            const payload = admin
            const secretkey = "wonbinku"
            const token = sign(payload, secretkey)
            return response
                .status(200)
                .json({
                    status: true,
                    message: "login berhasil cui",
                    token: token
                })
        }

        else {
            return response
                .status(200)
                .json({
                    status: false,
                    message: "egk bs masuk cui"
                })
        }
    } catch (error) {
        return response
            .status(500)
            .json({
                status: false,
                message: error
            })
    }
}

export { createAdmin, readAdmin, updateAdmin, deleteAdmin, login }

