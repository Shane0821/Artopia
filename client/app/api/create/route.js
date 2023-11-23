import axios from 'axios';

import Art from "@models/Art";
import { connectToDB } from "@utils/database";
import { default64_1, default64_2 } from './default64.js';

import { getToken } from "next-auth/jwt"

export const POST = async (request) => {
    const data = await request.json();

    // // If seed is empty, exclude it in the data
    // if (data.seed === undefined) {
    //     delete data.seed;
    // }

    try {
        const token = await getToken({ req: request });
        // Not Signed in
        if (!token) throw new Error("Unauthorized.");
        // get address
        const address = token.sub;

        if (!data.prompt.trim()) {
            throw new Error("Empty prompt.");
        }

        const options = {
            method: 'POST',
            url: 'https://api.getimg.ai/v1/stable-diffusion/text-to-image',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Bearer ${process.env.SDK_AUTH}`
            },
            data: {
                model: data.model,
                prompt: `${data.prompt}`,
                negative_prompt: `${data.negative_prompt}`,
                width: data.width,
                height: data.height,
                steps: data.steps,
                guidance: data.guidanceScale,
                seed: data.seed,
                scheduler: data.sampler
            }
        };
        // console.log(options, data.address)

        // const res = await axios.request(options);

        // for development
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        await sleep(3000)
        // fake res
        const res = {
            data: {
                image: (Math.floor(Math.random() * 2) ? default64_1 : default64_2),
                seed: 0
            }
        }

        // connect to database to store art
        await connectToDB()

        const newArt = new Art({
            address: address,
            base64: `data:image/jpeg;base64,${res.data.image}`,
            seed: res.data.seed,
            model: data.model,
            prompt: `${data.prompt}`,
            negative_prompt: `${data.negative_prompt}`,
            width: data.width,
            height: data.height,
            steps: data.steps,
            guidance: data.guidanceScale,
            scheduler: data.sampler
        });

        await newArt.save();

        return new Response(
            JSON.stringify(newArt),
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

export const GET = async (request) => {
    try {
        const token = await getToken({ req: request });
        // Not Signed in
        if (!token) throw new Error("Unauthorized.");
        // get address
        const address = token.sub;

        await connectToDB()

        const art = await Art.find({ address });

        return new Response(
            JSON.stringify(art),
            { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({
            message: 'Failed to get',
            error: error
        }), { status: 500 });
    }
}