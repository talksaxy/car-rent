import { PrismaClient } from "../../node_modules/.prisma/client/index"
import { Request, Response } from "express"

const prisma = new PrismaClient()

const createRent = async (request: Request, response: Response) => {
    try {
        /** read a request from body */
        const carID : number = (request.body.carID)
        const nama_penyewa = String (request.body.nama_penyewa)
        const tanggal = new Date(request.body.tanggal).toISOString()
        const lama_sewa = request.body.lama_sewa

        const car = await prisma.car.findFirst({ where: { carID: carID } })
        if (!car) {
            return response.status(400).json({
                status: false,
                message: `Data car not found`
            })
        }
        const total_bayar = car.harga_perhari * lama_sewa

        /** insert to events table using prisma */
        const newData = await prisma.rent.create({
            data: {
                carID,
                nama_penyewa, 
                tanggal,
                lama_sewa,
                total_bayar
            }
        })

        return response
        .status(200)
        .json({
            status: true,
            message: `Rent has been booked`,
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

const readRent = async (request: Request, response: Response) =>{
    try {
        const dataRent = await prisma.rent.findMany()
        return response
        .status(200)
        .json({
            status: true,
            message: `Rent has been loaded`,
            data: dataRent
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

const updateRent = async (request: Request, response: Response) => {
    try {
        const rentID = Number(request.params.rentID)
        const carID = Number(request.body.carID)
        const nama_penyewa = String (request.body.nama_penyewa)
        const tanggal = new Date(request.body.tanggal).toISOString()
        const lama_sewa = request.body.lama_sewa
        const total_bayar = Number(request.body.total_bayar)


        /** make sure datanya sudah ada */
        const findRent = await prisma.rent.findFirst({
            where: { rentID: rentID}
        })

        /**give a response when event not found */
        if(!findRent){
            return response.status(400)
            .json({
                status: false,
                message: `Data rent not found`
            })
        }

        const updateRent = await prisma.rent.update({
            where: { rentID: rentID}, //gatau numbernya diisi apa
            data: {
                carID: carID || findRent.carID,
                nama_penyewa: nama_penyewa || findRent.nama_penyewa,
                tanggal: tanggal || findRent.tanggal,
                lama_sewa: lama_sewa || findRent.lama_sewa,
                total_bayar: total_bayar || findRent.total_bayar
            }
        })

        return response.status(200)
        .json({
            status: true,
            message: `Rent has been updated`,
            data: updateRent
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

const deleteRent = async (request: Request, response: Response) => {
    try {
        const renID = Number(request.params.rentID)

        /** make sure that event is exist*/
        const findRent = await prisma.rent.findFirst({
            where: { rentID: renID} //numbernya gtw diisi apa
        })

        if(!findRent){
            return response.status(400)
            .json({
                status: false, 
                message: `Rent not found`
            })
        }

        /** execute for delete event */
        const deleteTicket = await prisma.rent.delete({
            where: { rentID: renID}//numbernya gtw diisi apa
        })

        return response.status(200)
        .json({
            status: true,
            message:`Data rent has been deleted`
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

export { createRent, readRent, updateRent, deleteRent }
