import Art from "@models/Art";
import { connectToDB } from "@utils/database";

import { getToken } from "next-auth/jwt"

export const GET = async (request) => {
    try {
        await connectToDB()

        const token = await getToken({ req: request, secret: process.env.SECRET })
        const userAddress = token?.address

        const sharedArtWithActions = await Art.aggregate([
            { $match: { shared: true } },
            {
                $lookup: {
                    from: 'Action', // replace with your Action collection name
                    localField: '_id',
                    foreignField: 'artId',
                    as: 'actionData'
                }
            }
        ]);

        return new Response(
            JSON.stringify(sharedArtWithActions),
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