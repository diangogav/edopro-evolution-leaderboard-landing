'use client';

import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import Banlists from '../components/Banlists/index';
import { AuthContext } from '@/context/auth/AuthContext';

export default function Home() {
	const { user } = useContext(AuthContext);
	const hasAccess = user?.role === 'ADMIN' || user?.role === 'MANAGER';
	if (!hasAccess) {
		return <h1 className='text-center text-white' >Unauthorized</h1>;
	}

	// const banlists = user?.permissions?.banlists;
	console.log("🚀 ~ Home ~ user:", user)
	// console.log("🚀 ~ Home ~ banlists:", banlists)
	
	return (
		<main>
			{/* <Banlists tournaments = {tournaments} /> */}
			<Toaster position="bottom-center" reverseOrder={false}/>
		</main>
	);
}