import { LeaderboardUpdater } from '@/modules/leaderboard/application/LeaderboardUpdater'
import { LeaderboardRedisRepository } from '@/modules/leaderboard/infrastructure/LeaderboardRedisRepository'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST') {
		if(req.query.key !== process.env.CRON_JOB_SECRET) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const leaderboardUpdater = new LeaderboardUpdater(new LeaderboardRedisRepository());
		await leaderboardUpdater.run('general');
		await leaderboardUpdater.run('2024.09 TCG');
		await leaderboardUpdater.run('2024.04 TCG');
		await leaderboardUpdater.run('2024.4 TCG KS');
		await leaderboardUpdater.run('Edison(PreErrata)');
		await leaderboardUpdater.run('2005.4 GOAT');
		await leaderboardUpdater.run('JTP (Original)');
		return res.status(200).json({});
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
