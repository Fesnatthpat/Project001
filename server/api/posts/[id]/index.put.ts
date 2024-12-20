import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

// ฟังก์ชันสำหรับการอัปเดตโพสต์
export default defineEventHandler(async (event) => {
    try {
        const body = await readMultipartFormData(event)

        // ดึงค่าจากฟอร์ม title, content, image
        const title = body?.find(item => item.name === "title")?.data?.toString()
        const content = body?.find(item => item.name === "content")?.data?.toString()
        const image = body?.find(item => item.name === "image")
        const postId = Number(event.context.params?.id) // ดึง ID ของโพสต์ที่ต้องการอัปเดต

        // ตรวจสอบว่า title, content มีข้อมูลหรือไม่
        if (!title || !content) {
            throw createError({ statusCode: 400, message: "Missing required fields" })
        }

        const updatedData: any = { title, content }

        // หากมีการอัปโหลดไฟล์ใหม่
        if (image?.data && image.filename) {
            const ext = path.extname(image.filename).toLowerCase()
            if (![".png", ".jpg"].includes(ext)) {
                throw createError({ statusCode: 400, message: "Invalid file type" })
            }

            // ตรวจเช็คขนาดไฟล์
            if (image.data.length > 5 * 1024 * 1024) {
                throw createError({ statusCode: 400, message: "File too large" })
            }

            const uploadsDir = path.join(process.cwd(), "public/uploads")
            await fs.mkdir(uploadsDir, { recursive: true })

            // สร้างชื่อไฟล์ใหม่และบันทึกลงในระบบ
            const filePath = path.join(uploadsDir, `${uuidv4()}${ext}`)
            await fs.writeFile(filePath, image.data)

            // เพิ่ม URL ของรูปภาพที่อัปเดตในฐานข้อมูล
            updatedData.imageUrl = `/uploads/${path.basename(filePath)}`
        }

        // อัปเดตข้อมูลโพสต์ในฐานข้อมูล
        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: updatedData
        })

        return updatedPost

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
