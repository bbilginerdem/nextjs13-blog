import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function TopNav() {
	const { data, status } = useSession();

	return (
		<nav className='nav shadow p-2 justify-content-between mb-3'>
			<Link className='nav-link' href='/'>
				BLOG
			</Link>

			{status === 'authenticated' ? (
				<div className='d-flex'>
					<Link
						className='nav-link'
						href={`/dashboard/${data?.user.role === 'admin' ? 'admin' : 'user'}`}
					>
						{data?.user?.name} ({data?.user?.role})
					</Link>
					<button className='nav-link pointer' onClick={() => signOut({ callbackUrl: '/login' })}>
						Logout
					</button>
				</div>
			) : (
				<div className='d-flex'>
					<Link className='nav-link' href='/login'>
						Login
					</Link>
					<Link className='nav-link' href='/register'>
						Register
					</Link>
				</div>
			)}
		</nav>
	);
}
