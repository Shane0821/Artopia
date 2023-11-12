import Art from "@models/Art";
import { connectToDB } from "@utils/database";

import { getToken } from "next-auth/jwt"

export const GET = async (request) => {
    try {
        await connectToDB()

        const token = await getToken({ req: request, secret: process.env.SECRET })
        const userAddress = token?.address

        const sharedArt = await Art.find({ shared: true });

        for (let art of sharedArt) {
            art.views = art.viewedBy.length;
            art.likes = art.likedBy.length;
            art.viewedByUser = art.viewedBy.includes(userAddress);
            art.likedByUser = art.likedBy.includes(userAddress);
        }

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