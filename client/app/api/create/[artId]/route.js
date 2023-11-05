import { getToken } from "next-auth/jwt"

import Art from "@models/Art";
import { connectToDB } from "@utils/database";

export const DELETE = async (request, { params }) => {
    try {
        const token = await getToken({ req: request });
        // Not Signed in
        if (!token) throw new Error("Unauthorized.");
        // get address
        const address = token.sub;
        const _id = params.artId;

        // console.log(address, _id)

        await connectToDB()
        await Art.deleteOne({ _id, address });

        return new Response(
            JSON.stringify({}),
            { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({
            message: 'Failed to create a new prompt',
            error: error
        }), { status: 500 });
    }
}

