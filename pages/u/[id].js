import styles from "../../styles/UserPage.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import {
   toSentenceCase,
   getDateFormatting,
   sentenceCase,
   getRoleFormatting,
} from "../../utils"
import Loading from "../../components/Loading"
import { prisma } from "../../lib/prisma.js"
import {
   Button,
   Text,
   useModal,
   Modal,
   Table,
   ButtonGroup,
} from "@geist-ui/core"
import { UserX, Plus, ArrowUp, User } from "@geist-ui/icons"
import Router from "next/router"
import UserDetailsContent from "../../components/UserDetailsContent"
import { isTypeParameterDeclaration } from "typescript"

export const getServerSideProps = async ({ params }) => {
   const user = await prisma.user.findUnique({
      where: {
         id: String(params?.id),
      },
      include: {
         extraWorkouts: {
            select: {
               id: true,
               description: true,
               createdAt: true,
               updatedAt: true,
               time: true,
               user: false,
            }
            // orderBy: {
            //    createdAt: "desc",
            // }
         },
      },
   })

   console.log("id:", params?.id)
   console.log("user:", user)

   if (user.createdAt !== null) {
      user.createdAt = user.createdAt.toISOString()
   }
   if (user.updatedAt !== null) {
      user.updatedAt = user.updatedAt.toISOString()
   }
   if (user.extraWorkouts !== null) {
      user.extraWorkouts.map((workout) => {
         if (workout.createdAt !== null) {
            workout.createdAt = workout.createdAt.toISOString()
         }
         if (workout.updatedAt !== null) {
            workout.updatedAt = workout.updatedAt.toISOString()
         }
      })
      // for (const workout of user.extraWorkouts) {
      //    if (workout.updatedAt !== null) {
      //       workout.updatedAt = workout.updatedAt.toISOString()
      //    }
      //    if (workout.createdAt !== null) {
      //       workout.createdAt = workout.createdAt.toISOString()
      //    }
      // }
   }

   console.log("workouts:", user.extraWorkouts)

   return {
      props: user,
   }
}

export default function UserPage(props) {
   const { data: session, status } = useSession()
   const { visible, setVisible, bindings } = useModal()
   const [viewingDetails, setViewingDetails] = useState(false)
   const [relevantUser, setRelevantUser] = useState(null)
   const [viewingUser, setViewingUser] = useState(false)

   if (status === "loading") {
      return <Loading />
   }

   function getGradYearFormatting(gy) {
      if (gy === null) {
         return ""
      }
      return "('" + gy.slice(gy.length - 2) + ")"
   }

   const removeUser = async (user_id) => {
      const body = { user_id }

      try {
         console.log(user_id)
         await fetch("/api/remove_user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
         }).then((res) => {
            Router.push("/dashboard/")
         })
      } catch (error) {
         console.log("error removing user:", error)
      }
   }

   const makeAdmin = async (user_id) => {
      const body = { user_id }

      try {
         console.log(user_id)
         await fetch("/api/make_admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
         })
      } catch (error) {
         console.log("error making user admin:", error)
      }
   }

   const cellText = (value, rowData, rowIndex) => {
      return (
         <p
            auto
            scale={1 / 2}
            font="12px"
         >
            {value}
         </p>
      )
   }

   const cellDate = (value, rowData, rowIndex) => {
      return (
         <p
            auto
            scale={1 / 2}
            font="12px"
         >
            {getDateFormatting(value)}
         </p>
      )
   }

   return (
      <div className={styles.container}>
         <div className={styles.header}>
            <div>
               <p className={styles.name}>{props.name}</p>
               <p className={styles.gradYear}>
                  {getGradYearFormatting(props.grad_year)}
               </p>
               <p className={styles.role}>
                  {getRoleFormatting(props.role, props.is_rookie)}
               </p>
            </div>
            <p className={styles.totalDueContainer}>
               Total minutes:{" "}
               <span className={styles.totalDue}
                  style={{
                     color: props.total_work <= 0 ? "red" : "black",
                  }}
               >
                  {props.total_work}
               </span>
            </p>
         </div>
         <div className={styles.belowName}>
            <div className={styles.email}>{props.email}</div>
            <div className={styles.userActions}>
               {session?.role == "admin" && props.role != "admin" && (
                  <div className={styles.adminActions}>
                     <Button
                        auto
                        icon={<User />}
                        onClick={() => {
                           setViewingUser(true)
                           setVisible(true)
                           setRelevantUser(props)
                        }}
                     >
                        Edit User
                     </Button>
                     <Button
                        auto
                        icon={<ArrowUp />}
                        onClick={() => makeAdmin(props.id)}
                     >
                        Make Admin
                     </Button>
                     <Button
                        icon={<UserX />}
                        type="error"
                        ghost
                        auto
                        onClick={() => removeUser(props.id)}
                     >
                        Remove User
                     </Button>
                  </div>
               )}
               <Modal {...bindings}>
                  {(
                     <UserDetailsContent
                        user={relevantUser}
                        setVisible={setVisible}
                     />
                  )}
               </Modal>
            </div>
         </div>
         {(!props.extraWorkouts || props.extraWorkouts.length === 0) && (
            <div>No workouts found!</div>
         )}
         <div>
            {props.extraWorkouts?.length !== 0 && (
               <Table
                  data={props.extraWorkouts}
               >
                  <Table.Column
                     prop="updatedAt"
                     label="Updated"
                     render={cellDate}
                     width="6%"
                  />
                  <Table.Column
                     prop="description"
                     label="Description"
                     render={cellText}
                     className={styles.description}
                  />
                  <Table.Column
                     prop="time"
                     label="Minutes"
                     render={cellText}
                     width="6%"
                  />
                  {/* <Table.Column
                     prop="actions"
                     label="Actions"
                     render={transactionOptions}
                     width={"120px"}
                  /> */}
               </Table>
            )}
         </div>
      </div>
   )
}
