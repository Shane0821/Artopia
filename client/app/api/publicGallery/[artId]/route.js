import { getToken } from "next-auth/jwt"

import Art from "@models/Art";
import Action from "@models/Action";
import { connectToDB } from "@utils/database";
import mongoose from 'mongoose'

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

export const POST = async (request, { params }) => {
    try {
        const token = await getToken({ req: request });
        // Not Signed in
        if (!token) throw new Error("Unauthorized.");
        // get address
        const address = token.sub;
        const _id = params.artId;

        await connectToDB()
        let action = await Action.findOne({ artId: _id });

        if (!action) {
            const newAction = new Action({
                artId: new mongoose.Types.ObjectId(_id)
            });
            await newAction.save();
            action = newAction
        }

        const data = await request.json()
        if (data.type === 'like') {
            await action.like(address);
        } else if (data.type === 'view') {
            await action.view(address);
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
            message: 'Failed to like.',
            error: error
        }), { status: 500 });
    }
}