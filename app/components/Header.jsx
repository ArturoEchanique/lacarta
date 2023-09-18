"use client";

import Link from 'next/link'
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const { data } = useSession();

  console.log("session data is: ", data);

  return (
    <header className='flex h-24 flex-col justify-center bg-stone-100'>
      <nav className='container'>
        <ul className='flex items-center justify-between gap-8 font-medium tracking-wider text-stone-500'>
          <li className='text-sm'>
            <Link href='/'>Home</Link>
          </li>
          <li className='text-sm'>
            <Link href='/vercarta/1'>Ver carta</Link>
          </li>
          <li className='text-sm'>
            <Link href='/crearcarta'>Crear carta</Link>
          </li>
          <li className='text-sm'>
            <Link href='/login'>New login</Link>
          </li>
          <li className='text-sm'>
            <Link href='/dashboard'>Dashboard -protected-</Link>
          </li>
          <div className="col-3 mt-3 mt-md-0 text-center d-flex flex-row">
          {data?.user ? (
            <>
              <span style={{ marginRight: "15px" }}>
                <img
                  src={data?.user?.image}
                  height="25"
                  width="25"
                  alt="user image"
                />
                Hi, {data?.user?.name}
              </span>

              <span style={{ cursor: "pointer" }} onClick={() => signOut()}>
                {" "}
                Logout
              </span>
            </>
          ) : (
            <span style={{ marginRight: "15px" }}>
              {" "}
              <Link className="nav-link" href="/login">
                Login
              </Link>
            </span>
          )}
        </div>
        </ul>
      </nav>
    </header>
  )
}

export default Header
