import Art from "@models/Art";
import { connectToDB } from "@utils/database";

import { getToken } from "next-auth/jwt"

export const GET = async (request) => {
    try {
        await connectToDB()

        const sharedArt = await Art.find({ shared: true });

        return new Response(
            JSON.stringify(sharedArt),
            { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({
            message: 'Failed to get shared art pieces',
            error: error
        }), { status: 500 });
    }
}