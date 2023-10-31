import sdk from 'api';
const sdkInst = sdk('@getimg/v1.0#64l331elmooz4oo');

export const POST = async (request) => {
    const data = await request.json();

    // If seed is empty, exclude it in the data
    if (data.seed === undefined) {
        delete data.seed;
    }

    try {
        await sdkInst.auth(process.env.SDK_AUTH);

        const { data } = await sdkInst.postStableDiffusionTextToImage(data);

        return new Response(JSON.stringify({ data }), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Failed to create a new prompt',
            error: error
        }), { status: 500 });
    }
}