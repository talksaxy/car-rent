import { PrismaClient } from "../../node_modules/.prisma/client/index"
import { Request, Response } from "express"

const prisma: PrismaClient = new PrismaClient()

const createCar = async (request: Request, response: Response) => {
    try {
        /** read a request from body */
        const nopol = request.body.nopol
        const merek_mobil = request.body.merek_mobil
        const harga_perhari = Number(request.body.harga_perhari)

        /** insert to events table using prisma */
        const newData = await prisma.car.create({
            data: {
                nopol: nopol,
                merek_mobil: merek_mobil,
                harga_perhari: harga_perhari
            }
        })

        return response
        .status(200)
        .json({
            status: true,
            message: `Car has been created`,
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

const readCar = async (request: Request, response: Response) =>{
    try {
        const page = Number(request.query.page) || 1;
        const qty = Number (request.query.qty) || 10;
        const keyword = request.query.keyword?.toString() || "";
        const dataCar = await prisma.car.findMany({
            take: qty, //mendefinisikan data yang diambil
            skip: (page - 1) * qty,
            where: {
                OR: [
                    {merek_mobil: {contains: keyword}}
                ]
            },
            orderBy: {carID: "asc"}
        })
        return response
        .status(200)
        .json({
            status: true,
            message: `Car has been loaded`,
            data: dataCar
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

const updateCar = async (request: Request, response: Response) => {
    try {
        const carID = Number(request.params.carID)
        const nopol = request.body.nopol
        const merek_mobil = request.body.merek_mobil
        const harga_perhari = Number(request.body.harga_perhari)


        /** make sure datanya sudah ada */
        const findCar = await prisma.car.findFirst({
            where: { carID: Number(carID)}
        })

        /**give a response when event not found */
        if(!findCar){
            return response.status(400)
            .json({
                status: false,
                message: `Data car not found`
            })
        }

        const updateCar = await prisma.car.update({
            where: { carID: Number(carID)}, //numbernya gatau diisi apa
            data: {
                carID: carID,
                nopol: nopol,
                merek_mobil: merek_mobil,
                harga_perhari: harga_perhari
            }
        })

        return response.status(200)
        .json({
            status: true,
            message: `Car has been updated`,
            data: updateCar
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

const deleteCar = async (request: Request, response: Response) => {
    try {
        /** get event ID from URL */
        const carID = request.params.carID

        /** make sure that event is exist*/
        const findCar = await prisma.car.findFirst({
            where: { carID: Number(carID)} //number nya gtw diisi apa
        })

        if(!findCar){
            return response.status(400)
            .json({
                status: false, 
                message: `Car not found`
            })
        }

        /** execute for delete event */
        const dataCar = await prisma.car.delete({
            where: { carID: Number(carID)}//number nya gtw diisi apa
        })

        return response.status(200)
        .json({
            status: true,
            message:`Data car has been deleted`
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

export { createCar, readCar, updateCar, deleteCar }