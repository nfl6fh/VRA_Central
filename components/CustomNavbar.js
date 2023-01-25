import styles from "../styles/CustomNavbar.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { userInfo } from "os"
import { Router } from "next/router"
import Link from "next/link"

export default function CustomNavbar(props) {
   const { data: session, status } = useSession()

   return (
      <div className={styles.navbar}>
         <Link href="/">
            <a className={styles.brand}>
               VRA Central
            </a>
         </Link>

         <div className={styles.verifiedSessionButtons}>
            {session?.role == "admin" && (
               <Link href="/full_team">
                  <a className={styles.adminButton}>Home</a>
               </Link>
            )}
         </div>

         <div className={styles.navbarRight}>
            {session?.user && (
               <a
                  className={styles.navButton}
                  href={`/api/auth/signout`}
                  onClick={(e) => {
                     e.preventDefault()
                     signOut({
                        callbackUrl: `${window.location.origin}`,
                     })
                  }}
               >
                  Sign Out
               </a>
            )}
            {!session?.user && (
               <p className={styles.navButton} onClick={() => signIn("google")}>
                  Sign in
               </p>
            )}
         </div>
      </div>
   )
}
