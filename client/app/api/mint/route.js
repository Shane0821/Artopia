import axios from 'axios';

import ArtIpfs from "@models/ArtIpfs";
import { connectToDB } from "@utils/database";

import { getToken } from "next-auth/jwt"

export const POST = async (request) => {
    const data = await request.json();

    try {
        const token = await getToken({ req: request });
        // Not Signed in
        if (!token) throw new Error("Unauthorized.");
        // get address
        const address = token.sub;

        // connect to database to store art
        // await connectToDB()

        // const newArt = new Art({
        //     address: address,
        //     base64: `data:image/jpeg;base64,${res.data.image}`,
        //     seed: res.data.seed,
        //     model: data.model,
        //     prompt: `${data.prompt}`,
        //     negative_prompt: `${data.negative_prompt}`,
        //     width: data.width,
        //     height: data.height,
        //     steps: data.steps,
        //     guidance: data.guidanceScale,
        //     scheduler: data.sampler
        // });

        // await newArt.save();

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        await sleep(3000)

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