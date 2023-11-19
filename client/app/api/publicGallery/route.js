import Art from "@models/Art";

import { connectToDB } from "@utils/database";

import { getToken } from "next-auth/jwt"

export const GET = async (request) => {
    try {
        await connectToDB()

        const token = await getToken({ req: request, secret: process.env.SECRET })
        const userAddress = token?.address

        const sharedArtWithActions = await Art.aggregate([
            {
                $lookup:
                {
                    from: "actions", // assuming 'actions' is the collection name for Action model
                    localField: "_id", // field from the Art collection
                    foreignField: "artId", // field from the Action collection
                    as: "action"
                }

            },
            {
                $match: {
                    shared: true
                }
            }
        ])


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