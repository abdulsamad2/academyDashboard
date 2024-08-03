'use server'
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
export const deleteDb = (id: any) => {
    return prisma.user.delete({
        where: {
            id
        }
    })
}


