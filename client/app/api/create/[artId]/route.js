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
        await Art.deleteOne({ id: _id, address: address, minted: false });

        return new Response(
            JSON.stringify({}),
            { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({
            message: 'Failed to delete art.',
            error: error
        }), { status: 500 });
    }
}

export const PATCH = async (request, { params }) => {
    const { title } = await request.json();

    try {
        const token = await getToken({ req: request });
        // Not Signed in
        if (!token) throw new Error("Unauthorized.");
        // get address
        const address = token.sub;
        const _id = params.artId;

        // console.log(address, _id)

        await connectToDB()
        const art = await Art.findOne({ _id, address });

        if (!art) throw new Error('Art not found.')

        art.title = title;

        await art.save();

        return new Response(
            JSON.stringify({}),
            { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({
            message: 'Failed to update art title.',
            error: error
        }), { status: 500 });
    }
}


