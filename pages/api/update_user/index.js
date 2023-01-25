import {prisma} from "../../../lib/prisma.js";

// PUT /api/update_user
export default async function handle(req, res) {
    const user_id = req.body.user_id;
    const name = req.body.name;
    const gradYear = req.body.gradYear;
    // const role = req.body.role;
    const email = req.body.email;
    console.log("body", req.body)
    
    const post = await prisma.user.update({
        where: { id: user_id },
        data: {
            name: name,
            grad_year: gradYear,
            email: email,
        },
    });
    res.json(post);
}