import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
    try {
        const posts = await prisma.post.findMany();
        return posts;
    } catch (error) {
        console.error("Database connection error:", error);
        throw createError({ statusCode: 500, message: "Database connection failed" });
    }
});
