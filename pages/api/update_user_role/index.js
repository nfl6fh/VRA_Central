import { prisma } from "../../../lib/prisma.js"

// PUT /api/update_user_role
// this code is a mess
export default async function handle(req, res) {
   const user_id = req.body.uid
   const role = req.body.role
   const gradYear = req.body.gradYear
   const email = req.body.email

   console.log("user_id: " + user_id)
   console.log("role: " + role)
   console.log("gradYear: " + gradYear)

   if (role === "rookie") {
      const response = await prisma.user
         .update({
            where: { id: user_id },
            data: {
               is_rookie: true,
               grad_year: String(gradYear),
               email: String(email),
            },
         })
         .then((res) => {
            return res
         })

         return res.json(response)
   }
   //    else if (role == "coach") {
   //       const post = await prisma.user.update({
   //          where: { id: user_id },
   //          data: {
   //             role: "admin",
   //             is_rookie: false,
   //          },
   //       })
   //    }
   else {
      // is varsity athlete
      const response = await prisma.user
         .update({
            where: { id: user_id },
            data: {
               is_rookie: false,
               grad_year: String(gradYear),
               email: String(email),
            },
         })
         .then((res) => {
            return res
         })

        return res.json(response)
   }

   
}
