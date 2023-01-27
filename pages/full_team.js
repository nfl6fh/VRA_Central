import { useSession } from "next-auth/react"
import { prisma } from "../lib/prisma.js"
import styles from "../styles/Admin.module.css"
import Loading from "../components/Loading"
import { useState } from "react"
import {
   getRoleFormatting,
   deleteUser,
} from "../utils.js"
import Router from "next/router.js"
import { Input, Button, Modal, useModal, Table, Text, Radio } from "@geist-ui/core"

export const getServerSideProps = async () => {
   // var unverified_users = await prisma.user.findMany({
   //    where: { is_verified: false },
   // })

   var verified_users = await prisma.user.findMany({
      where: { is_verified: true },
      include: {
         extraWorkouts: true,
      },
   })

   // var today = new Date();
   // var mm = String(today.getMonth() + 1).padStart(2, '0');
   // var yyyy = today.getFullYear();

   // var year = mm >= '06' ? yyyy : yyyy - 1;
   // var yearString = year.toString();

   // var graduating_users = await prisma.user.findMany({
   //    where: { grad_year: yearString },
   // })

   verified_users.map((user) => {
      if (user.createdAt !== null) {
         user.createdAt = user.createdAt.toString()
      }
      if (user.updatedAt !== null) {
         user.updatedAt = user.updatedAt.toString()
      }
      // iterate through user.extraWorkouts and add up the time of workouts from the past 7 days
      var past_7_work = 0
      user.extraWorkouts.map((workout) => {
         if (workout.createdAt !== null) {
            workout.createdAt = workout.createdAt.toISOString()
         }
         if (workout.updatedAt !== null) {
            workout.updatedAt = workout.updatedAt.toISOString()
         }
         var seven_days_ago = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
         // var mm = String(seven_days_ago.getMonth() + 1).padStart(2, '0');
         // var dd = String(seven_days_ago.getDate()).padStart(2, '0');
         // TODO: Fix this
         if (workout.date.getMonth() >= seven_days_ago.getMonth() && workout.date.getDate() >= seven_days_ago.getDate()) {
            past_7_work += workout.time
         }
         if (workout.date !== null) {
            workout.date = workout.date.toISOString()
         }
      })
      console.log("past_7_work:", past_7_work)
      user.past_7_work = past_7_work
   })

   verified_users = verified_users?.sort((a, b) => b.total_work - a.total_work)
   const p7u = verified_users?.sort((a, b) => b.past_7_work - a.past_7_work)

   console.log("verified_users:", verified_users)

   return { props: { verified_users, p7u } }
}

export default function Admin(props) {
   const { data: session, status } = useSession()
   const [state, setState] = useState('names')
   const handler = val => {
      setState(val)
      console.log(val)
   }

   const width_name = "100%"
   const width_gy = "8%"
   const width_role = "120px"
   const width_actions = "180px"

   if (status === "loading") {
      return <Loading />
   }

   // const verifyUser = async (user_id) => {
   //    const body = { user_id }

   //    try {
   //       console.log(user_id)
   //       await fetch("/api/verify_user", {
   //          method: "POST",
   //          headers: { "Content-Type": "application/json" },
   //          body: JSON.stringify(body),
   //       }).then((res) => {
   //          Router.reload()
   //       })
   //    } catch (error) {
   //       console.log("error verifying user:", error)
   //    }
   // }

   const cellText = (value, rowData, rowIndex) => {
      return (
         <Text auto scale={1 / 2}>
            {value}
         </Text>
      )
   }

   const athleteName = (value, rowData, rowIndex) => {
      return (
         <p
            auto
            scale={1 / 2}
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => {
               Router.push("/u/[id]", `/u/${rowData?.id}`)
            }}
         >
            {value}
         </p>
      )
   }

   if (session?.is_verified) {
      return (
         <div className={styles.container}>
            <h1 className={styles.title}>Full Team Extra Minutes</h1>


            {/* Use for admin page when that is implemented */}

            {/* {props.unverified_users?.length > 0 && (
               <div className={styles.unverifiedUsersContainer}>
                  <h2 className={styles.sectionHeading}>Unverified Users</h2>
                  <Table data={props.unverified_users}>
                     <Table.Column
                        prop="name"
                        label="Name"
                        render={unverifiedName}
                        width={width_name}
                     />
                     <Table.Column
                        prop="role"
                        label="Role"
                        render={athleteRole}
                        width={width_role}
                     />
                     <Table.Column
                        prop="grad_year"
                        label="Grad Year"
                        render={emailText}
                        width={width_gy}
                     />
                     <Table.Column
                        prop="email"
                        label="Email"
                        render={emailText}
                     />
                     <Table.Column
                        prop="actions"
                        label="Actions"
                        render={userActions}
                        width={width_actions}
                     />
                  </Table>
               </div>
            )} */}
            <div className={styles.workTables}>
               <div className={styles.workTable}>
                  <h2 className={styles.sectionHeading}>Total Extra Work</h2>
                  <Table auto data={props.verified_users.sort((a, b) => b.total_work - a.total_work)}>
                     <Table.Column prop="name" label="Athlete" render={athleteName} width={width_name} />
                     <Table.Column
                        prop="total_work"
                        label="Extra Minutes"
                        render={cellText}
                     >
                     </Table.Column>
                  </Table>
               </div>
               <div className={styles.workTable}>
                  <h2 className={styles.sectionHeading}>Last Week Extra Work</h2>
                  <Table auto data={ props.p7u.sort((a, b) => b.past_7_work - a.past_7_work) }> {/*props.verified_users.sort((a, b) => b.past_7_work - a.past_7_work)}>*/}
                     <Table.Column prop="name" label="Athlete" render={athleteName} width={width_name} />
                     <Table.Column
                        prop="past_7_work"
                        label="Extra Minutes"
                        render={cellText}
                     >
                     </Table.Column>
                  </Table>
               </div>
            </div>
         </div>
      )
   } else {
      Router.push("/")
      return <Loading />
   }
}
