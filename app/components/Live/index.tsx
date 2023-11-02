'use client'

import Marquee from '@/app/components/magicui/Marquee';
import { ReactNode, useContext } from 'react';
import LetterAvatar from '../LetterAvatar';
import { RoomsContext } from '@/context/rooms/RoomsContext';
import { RealTimeRoom } from '@/modules/room/domain/RealTimeRoom';

const Player = (props: any) => {
	return (
		<div className='flex flex-col items-center'>
			<div className='flex items-center justify-center'>
				<LetterAvatar name={props.name} size={32} fontSize={'0.75rem'} />
			</div>
			<p className='text-sm font-sm text-white-900'>{props.name}</p>
		</div>
	);
};

const RoomCard = ({ players }: RealTimeRoom, size?: string) => {
	return (
		<a
			target='_blank'
			rel='noopener noreferrer'
			className={`relative ${
				size === 'large'
					? 'min-w-[250px] border-yellow-300 hover:border-yellow-200'
					: 'min-w-[50px] border-slate-900 hover:border-slate-900/75'
			} flex justify-center items-center overflow-hidden rounded-xl border bg-slate-800/50 w-full py-4 px-12 transition hover:bg-slate-800/75 hover:shadow-lg group`}
		>
			<div className='flex flex-row items-center justify-center w-full h-auto gap-2 text-white transition group-hover:scale-110'>
				<Player key={players[0].position} name={players[0].username} />
				<span className='px-2'>vs</span>
				<Player key={players[1].position} name={players[1].username} />
			</div>
		</a>
	);
};

const Live = () => {
	const { rooms } = useContext( RoomsContext );

	return (
		<section className='flex flex-col flex-wrap items-center justify-center'>
			<div className='flex gap-2'>
				<div className='live-icon mb-4'></div>
				<span className='text-sm text-white'>Live</span>
			</div>
			<div className='relative flex flex-col items-center justify-center w-full h-full gap-4 overflow-hidden rounded-lg bg-background'>
				<div className={`relative ${rooms.length < 4 ? 'flex-row gap-x-4' : 'flex-col'} flex w-full overflow-hidden gap-y-4`}>
					{rooms.length < 4 ? (
						<>
							{rooms.map((room) => {
								return <RoomCard key={room.id} {...room} />;
							})}
						</>
					) : (
						<Marquee pauseOnHover className='[--duration:30s]'>
							{rooms.map((room) => {
								return <RoomCard key={room.id} {...room} />;
							})}
						</Marquee>
					)}

					<div className='absolute inset-y-0 left-0 w-40 pointer-events-none from-[#000214] to-transparent bg-gradient-to-r '></div>
					<div className='absolute inset-y-0 right-0 w-1/3 pointer-events-none bg-gradient-to-l from-[#000214]'></div>
				</div>
			</div>
		</section>
	);
};

export default Live;
