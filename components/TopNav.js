import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function TopNav() {
  const { data, status } = useSession()
  console.log("🚀 ~ file: TopNav.js:6 ~ TopNav ~  data, status :", data, status)


  return (
    <nav className="nav shadow p-2 justify-content-between mb-3">
      <Link className="nav-link" href="/">
        BLOG
      </Link>

      {status === "authenticated" ? (
        <>
          <div className="d-flex">
            <Link className="nav-link" href="/dashboard/user">
              Dashboard
            </Link>
            <a className="nav-link pointer" onClick={() => signOut({ callbackUrl: '/login' })}>
              Logout
            </a>
          </div>
        </>
      ) : (
        <div className="d-flex">
          <Link className="nav-link" href="/login">
            Login
          </Link>
          <Link className="nav-link" href="/register">
            Register
          </Link>
        </div>
      )}
    </nav>
  )
}
