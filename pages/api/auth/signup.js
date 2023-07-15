import { createClient } from 'redis';

const handler = async (req, res) => {
	if (req.method === 'POST') {
		const client = createClient({ url: process.env.REDIS_URL });
		client.on('error', (err) => console.log('Redis Client Error', err));
		await client.connect();
		const { username, password, email } = req.body;
		const usernameExists = await client.EXISTS(`user:${username}`);
		if (usernameExists) {
			res.status(409).json({ error: 'Username already registered' });
			return;
		}
		const emailExists = await client.EXISTS(`email:${email}`);
		if (emailExists) {
			res.status(409).json({ error: 'Email already registered' });
			return;
		}
		const create = await client.hSet(`user:${username}`, { username, password, email });
		if (create === 3) { //This is the number of fields that we are setting
			await client.set(`email:${email}`, username);
			await client.zAdd('leaderboard:points', { score: 0, value: username });
			await client.zAdd('leaderboard:wins', { score: 0, value: username });
			await client.zAdd('leaderboard:losses', { score: 0, value: username });
			await client.quit();
			res.status(202).json({ message: 'User created' });
		} else {
			await client.quit();
			res.status(500).json({ error: 'User not created' });
			return;
		}
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
};

export default handler;