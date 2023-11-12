import { getToken } from "next-auth/jwt"

import Art from "@models/Art";
import { connectToDB } from "@utils/database";

export const PATCH = async (request, { params }) => {
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

        art.shared = !art.shared;

        await art.save();

        return new Response(
            JSON.stringify(art.shared),
            { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({
            message: 'Failed to update art shared status.',
            error: error
        }), { status: 500 });
    }
}



import Action from "@models/Action";

export const POST = async (request, { params }) => {
    try {
        const token = await getToken({ req: request });
        // Not Signed in
        if (!token) throw new Error("Unauthorized.");
        // get address
        const address = token.sub;
        const _id = params.actionId;

        await connectToDB()
        const action = await Action.findOne({ _id });

        if (!action) throw new Error('Action not found.');

        if (request.body.type === 'like') {
            await action.like(address);
        } else if (request.body.type === 'view') {
            await action.view(address);
        } else if (request.body.type === 'unview') {
            await action.unview(address);
        } else {
            throw new Error('Invalid action type.');
        }

        return new Response(
            JSON.stringify({ likes: action.likes, views: action.views }),
            { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({
            message: 'Failed to update action.',
            error: error
        }), { status: 500 });
    }
}
