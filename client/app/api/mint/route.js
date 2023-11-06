import Art from "@models/Art";
import { connectToDB } from "@utils/database";
import { base64 } from "ethers/lib/utils";

import { getToken } from "next-auth/jwt"

const pinataApiKey = process.env.PINTA_API_KEY
const pinataApiSecret = process.env.PINTA_API_SECRET

const axios = require('axios');
const FormData = require('form-data');

async function uploadImageToPinata(title, id, base64Image) {
    // Convert base64 image to buffer
    let imageBuffer = Buffer.from(base64Image.substring(23), 'base64');

    // Create form data
    let formData = new FormData();
    formData.append('file', imageBuffer, {
        filename: `${title}_${id}.jpeg`,
        contentType: 'image/jpeg',
    });

    // Set pinata api endpoint
    let pinataUploadEndpoint = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

    // Upload image to pinata
    let response = await axios.post(pinataUploadEndpoint, formData, {
        maxContentLength: 'Infinity',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataApiSecret,
        },
    });

    return response;
}

async function uploadTextToPinata(prompt, negativePrompt) {
    // Upload text to pinata
    let textData = {
        prompt: prompt,
        negative_prompt: negativePrompt,
    };

    // Set pinata api endpoint
    let pinataUploadEndpoint = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

    let response = await axios.post(pinataUploadEndpoint, JSON.stringify(textData), {
        headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataApiSecret,
        },
    });

    return response;
}

export const POST = async (request) => {
    const data = await request.json();

    try {
        const token = await getToken({ req: request });
        // Not Signed in
        if (!token) throw new Error("Unauthorized.");
        // get address
        const address = token.sub;

        await connectToDB()

        const art = await Art.findOne({ address, _id: data._id });

        if (!art) throw new Error('Art not found.')

        const res_art = await uploadImageToPinata(art.title, art._id, art.base64);
        const res_prompt = await uploadTextToPinata(art.prompt, art.negative_prompt);

        return new Response(
            JSON.stringify({
                img_ipfs: res_art.data.IpfsHash,
                prompt_ipfs: res_prompt.data.IpfsHash
            }),
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