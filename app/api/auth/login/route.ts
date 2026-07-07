import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { cookies } from "next/headers";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

const loginSchema = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function POST(request: Request) {
    try{
        const body = await request.json();

        const parsed = loginSchema.safeParse(body);

        if(!parsed.success){
            return Response.json(
                {
                    error: "Invalid login data.",
                    issues: parsed.error.flatten().fieldErrors,
                },
                {
                    status: 400
                }
            );
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if(!user){
            return Response.json(
                {
                    error: "Invalid email or password."
                },
                {status: 401}
            );
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);

        if(!passwordMatches){
            return Response.json(
                {
                    error: "Invalid email or password."
                },
                {
                    status: 401
                }
            );
        }

        const token = createSessionToken(user.id);

        const cookieStore = await cookies();

        cookieStore.set(SESSION_COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return Response.json({
            ok: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });

        
    } catch (error) {
        console.error("Login error:", error);

        return Response.json(
            {
                error: "Something went wrong while logging in."
            },
            {status: 500}
        );
    }
}