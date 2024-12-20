import { PrismaClient } from "@prisma/client"
import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const body = await readMultipartFormData(event)

        //ดึงค่าจากฟอร์ม title,content,image
        const title = body?.find(item => item.name === "title")?.data?.toString()
        const content = body?.find(item => item.name === "content")?.data?.toString()
        const image = body?.find(item => item.name === "image")

        // ตรวจเช็คว่าข้อมูลที่จำเป็นมาครบถ้วนไหม title,content,image ถ้าไม่ใช่ก็จะโยนไปที่ throw
        if (!title || !content || !image?.data || !image.filename)
            throw createError({ statusCode: 400, message: "Missing required fields" })
        //ตรวจเช็คว่า นามสกุลไฟล์เป็น ".png", ".jpg" ไหม ถ้าไม่ใช่ก็จะโยนไปที่ throw
        const ext = path.extname(image.filename).toLowerCase()
        if (![ ".png", ".jpg" ].includes(ext))
            throw createError({ statusCode: 400, message: "Invalid file type" })

        //ตรวจเช็คว่า ขนาดไฟล์รูปภาพเกิน 5MB ไหม ถ้าไม่ใช่ก็จะโยนไปที่ throw
        if (image.data.length > 5 * 1024 * 1024)
            throw createError({ statusCode: 400, message: "File too large" })

        const uploadsDir = path.join(process.cwd(), "public/uploads")
        await fs.mkdir(uploadsDir, { recursive: true })

        //สร้างชื่อไฟล์ใหม่ด้วย UUIDV4
        const filePath = path.join(uploadsDir, `${uuidv4()}${ext}`)
        await fs.writeFile(filePath, image.data)

        //สร้างโพสต์ลงในฐานข้อมูล post
        const post = await prisma.post.create({
            data: {
                title,
                content,
                imageUrl: `/uploads/${path.basename(filePath)}`
            }
        })

        //คืนค่า post
        return post

    } catch (err) {
        if (err instanceof Error) {
            throw createError({
                statusCode: (err as any).statusCode || 500,
                message: err.message || "Internal Server Error"
            })
        } else {
            throw createError({
                statusCode: 500,
                message: "Unknown error occurred."
            })
        }
    }
})