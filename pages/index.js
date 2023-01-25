import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { userInfo } from "os"
import Loading from "../components/Loading"
import Router from "next/router"
import { useEffect, useState } from "react"
import { updateUserRole, generateGradYears } from "../utils"
import { Button, Text, Input, Select, Page } from "@geist-ui/core"

export default function Home() {
   const { data: session, status } = useSession()
   const [role, setRole] = useState("rookie")
   const [gradYear, setGradYear] = useState(
      String(new Date().getFullYear() + 4)
   )
   const [email, setEmail] = useState("")
   const [submitted, setSubmitted] = useState(false)

   const handleRoleChange = (val) => {
      setRole(val)
   }

   const handleGradYearChange = (val) => {
      setGradYear(val)
   }

   useEffect(() => {
      setEmail(session?.user?.email)
      setGradYear(session?.user_info?.grad_year)
      setRole(session?.user?.is_rookie ? "rookie" : "varsity")
   }, [session])

   if (status === "loading") {
      return <Loading />
   }

   if (session) {
      if (session.is_verified) {
         if (session.role && session.role !== "") {
            Router.push("/full_team")
            return <Loading />
         } else {
            Router.push("/u/[id]", `/u/${session.uid}`)
            return <Loading />
         }
      } else {
         // pending page
         return (
            <Page className={styles.pendingPage}>
               <div className={styles.pendingContent}>
                  <Text h1 className={styles.verifyingTitle}>
                     We're verifying your account
                  </Text>
                  <Text p className={styles.verifyingSubtitle}>
                     While you're here, confirm the information below
                  </Text>
                  <div className={styles.roleSection}>
                     <div className={styles.roleSelection}>
                        <pre>I am a </pre>
                        <Select
                           className={styles.inputOption}
                           placeholder="Role"
                           auto
                           onChange={handleRoleChange}
                           initialValue={role}
                        >
                           <Select.Option value="rookie">
                              rookie athlete
                           </Select.Option>
                           <Select.Option value="varsity">
                              varsity athlete
                           </Select.Option>
                        </Select>
                     </div>
                     <div className={styles.roleSelection}>
                        <pre>Email: </pre>
                        <Input
                           clearable
                           width="100%"
                           initialValue={session?.user?.email}
                           onChange={(e) => setEmail(e.target.value)}
                        />
                     </div>
                     <div className={styles.roleSelection}>
                        <pre>Expected grad year: </pre>
                        <Select
                           placeholder="Year"
                           onChange={handleGradYearChange}
                           initialValue={
                              session?.user_info?.grad_year ?? String(new Date().getFullYear() + 4)
                           }
                        >
                           {generateGradYears()
                              .reverse()
                              .map((year) => {
                                 return (
                                    <Select.Option value={String(year.id)}>
                                       {String(year.name)}
                                    </Select.Option>
                                 )
                              })}
                        </Select>
                     </div>
                  </div>
                  <div className={styles.buttonContainer}>
                     <Button
                        className={styles.saveButton}
                        disabled={submitted}
                        style={{ textTransform: "None" }}
                        onClick={() => {
                           if (email !== "") {
                              updateUserRole(role, gradYear, email, session.uid)
                              setSubmitted(true)
                           } else {
                              alert("Please enter a valid email")
                           }
                        }}
                     >
                        Yea, that's correct
                     </Button>
                  </div>
                  <div
                     auto
                     style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: 10,
                     }}
                  >
                     <p>  
                        {session.user_info.grad_year ? "Your data has been saved" : ""}
                     </p>
                  </div>
               </div>
            </Page>
         )
      }
   } else {
      // user is not logged in
      return (
         <div className={styles.hasBackground}>
            <main className={styles.main}>
               <Text h1 className={styles.title}>
                  VRA Central
               </Text>
               <Text h4 className={styles.subtitle}>
                  Cool improvement, huh?
               </Text>
               <br />
               <Button
                  className={styles.signInButton}
                  onClick={() => signIn("google")}
               >
                  Sign in with Google
               </Button>
            </main>
         </div>
      )
   }
}
