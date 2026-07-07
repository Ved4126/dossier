import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE_NAME = "dossier_session";

type SessionPayload = {
    userId: string;
}

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;

    if(!secret) {
        throw new Error("JWT secret is not set");
    }

    return secret;
}

export function createSessionToken(userId: string) {

    return jwt.sign(
        {
            userId,
        },
        getJwtSecret(),
        {
            expiresIn: "7d",
        }
    );
}

export async function getCurrentUser() {

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if(!token) {
        return null;
    }

    try {
        const payload = jwt.verify(token, getJwtSecret()) as SessionPayload;

        const user = await prisma.user.findUnique({
            where: {
                id: payload.userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        return user;
    } catch {
        return null;
    }

}

export { SESSION_COOKIE_NAME };