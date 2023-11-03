import Art from "@models/Art";
import { connectToDB } from "@utils/database";

export const GET = async (req, { params }) => {
    try {
        await connectToDB()

        const art = await Art.find({ address: params.address });

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