import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be of at least 8 characters."),
});

export async function POST(request: Request) {
    try{
        const body = await request.json();

        const parsed = signupSchema.safeParse(body);

        if(!parsed.success){
            return Response.json(
                {
                    error: "Invalid signup data.",
                    issues: parsed.error.flatten().fieldErrors,
                },
                {
                    status: 400
                }
            );
        }

        const {name, email, password} = parsed.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if(existingUser){

            return Response.json(
                {
                    error: "An account with this email already exists.",
                },
                {status: 409},
            );
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });


        return Response.json(
            {
                ok: true,
                user,
            },
            {
                status: 201
            }
        );
    } catch (error){
        console.error("Signup error:", error);

        return Response.json(
            {
                error: "Something went wrong while creating the account",
            },
            {
                status: 500
            },
        );
    }
}
