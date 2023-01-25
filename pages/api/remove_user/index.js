import { prisma } from '../../../lib/prisma.js';

// PUT /api/remove_user
export default async function handle(req, res) {
  const user_id = req.body.user_id

  const post = await prisma.user.update({
    where: { id: user_id },
    data: {
        is_verified: false
    },
  });
  res.json(post);
}