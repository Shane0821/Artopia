export const POST = async (request) => {
    const data = await request.json();

    // If seed is empty, exclude it in the data
    if (data.seed === undefined) {
        delete data.seed;
    }

    try {
        return new Response(JSON.stringify({ data }), { status: 200 })
    } catch (error) {
        return new Response("Failed to create a new prompt", { status: 500 });
    }
}