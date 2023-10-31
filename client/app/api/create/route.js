import axios from 'axios';

export const POST = async (request) => {
    const data = await request.json();

    // // If seed is empty, exclude it in the data
    // if (data.seed === undefined) {
    //     delete data.seed;
    // }

    try {
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

        console.log(options)

        // const res = await axios.request(options);
        res = {}

        console.log(res.data)

        return new Response(
            JSON.stringify(res.data),
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