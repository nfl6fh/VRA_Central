import { prisma } from '../../../lib/prisma.js';

// PUT /api/make_admin
export default async function handle(req, res) {
  const user_id = req.body.user_id

  const post = await prisma.user.update({
    where: { id: user_id },
    data: {
        role: "admin"
    },
  });
  res.json(post);
}