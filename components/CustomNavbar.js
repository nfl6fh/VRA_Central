import styles from "../styles/CustomNavbar.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { userInfo } from "os"
import { Router } from "next/router"
import Link from "next/link"

export default function CustomNavbar(props) {
   const { data: session, status } = useSession()

   return (
      <div className={styles.navbar}>
         <div className={styles.leftNavbar}>
            <Link href="/">
               <a className={styles.brand}>
                  VRA Central
               </a>
            </Link>

            <div className={styles.navbar1}>
               <div className={styles.dropdown}>
                  <button className={styles.dropbtn}>
                     Extra Work
                  </button>
                  <div className={styles.dropdown_content}>
                     <a href="/full_team">Full Team</a>
                     <a href="/u/[id]" as={`/u/${session?.uid}`}>My Minutes</a>
                     <a href="#">Log a Workout</a>
                  </div>
               </div>
            </div>
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
