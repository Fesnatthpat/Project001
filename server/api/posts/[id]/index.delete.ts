import { PrismaClient } from '@prisma/client'
import { promises as fs } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id') // ดึง id จาก route

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Invalid id'
        })
    }

    // 1. ดึงข้อมูล Post ก่อนเพื่อลบรูปภาพ
    const post = await prisma.post.findUnique({
        where: { id: Number(id) }
    })

    if (!post) {
        throw createError({
            statusCode: 404,
            message: 'Post not found'
        })
    }

    // 2. ลบรูปภาพออกจากโฟลเดอร์ public/uploads
    const imagePath = post.imageUrl
    if (imagePath) {
        const fullPath = join('public/uploads', imagePath.split('/').pop() || '')
        try {
            await fs.unlink(fullPath)
        } catch (error) {
            console.warn('Failed to delete image:', error)
        }
    }

    // 3. ลบ Post ออกจากฐานข้อมูล
    const deletedPost = await prisma.post.delete({
        where: { id: Number(id) },
    })

    return {
        message: 'Post and associated image deleted successfully',
        deletedPost
    }
})
