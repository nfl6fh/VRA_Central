import { prisma } from "../../../lib/prisma.js"

// PUT /api/delete_user
export default async function handle(req, res) {
   const user_id = req.body.user_id

   const deleteUser = await prisma.user.delete({
      where: {
         id: user_id,
      },
   })
}
