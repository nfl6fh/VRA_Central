import styles from "../styles/CustomFooter.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { userInfo } from "os"
import { Router } from "next/router"

export default function CustomNavbar(props) {
   const { data: session, status } = useSession()

   return (
      <div className={styles.container}>
         VRPay
      </div>
   )
}
