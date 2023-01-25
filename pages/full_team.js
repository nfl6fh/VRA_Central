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
   var unverified_users = await prisma.user.findMany({
      where: { is_verified: false },
   })

   var verified_users = await prisma.user.findMany({
      where: { is_verified: true },
   })

   // var today = new Date();
   // var mm = String(today.getMonth() + 1).padStart(2, '0');
   // var yyyy = today.getFullYear();
   
   // var year = mm >= '06' ? yyyy : yyyy - 1;
   // var yearString = year.toString();

   // var graduating_users = await prisma.user.findMany({
   //    where: { grad_year: yearString },
   // })


   unverified_users.map((user) => {
      if (user.createdAt !== null) {
         user.createdAt = user.createdAt.toString()
      }
      if (user.updatedAt !== null) {
         user.updatedAt = user.updatedAt.toString()
      }
   })

   verified_users.map((user) => {
      if (user.createdAt !== null) {
         user.createdAt = user.createdAt.toString()
      }
      if (user.updatedAt !== null) {
         user.updatedAt = user.updatedAt.toString()
      }
   })

   unverified_users = unverified_users?.sort((a, b) => a.name.localeCompare(b.name))

   verified_users = verified_users?.sort((a, b) => b.total_work - a.total_work)

   console.log("unverified_users:", unverified_users)
   console.log("verified_users:", verified_users)

   return { props: { unverified_users, verified_users} }
}

export default function Admin(props) {
   const { data: session, status } = useSession()
   const [state, setState] = useState('names')
   const handler = val => {
      setState(val)
      console.log(val)
   }

   const width_name = "12%"
   const width_gy = "8%"
   const width_role = "120px"
   const width_actions = "180px"

   if (status === "loading") {
      return <Loading />
   }

   const verifyUser = async (user_id) => {
      const body = { user_id }

      try {
         console.log(user_id)
         await fetch("/api/verify_user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
         }).then((res) => {
            Router.reload()
         })
      } catch (error) {
         console.log("error verifying user:", error)
      }
   }

   const cellText = (value, rowData, rowIndex) => {
      return (
         <Text auto scale={1 / 2}>
            {value}
         </Text>
      )
   }

   const athleteRole = (value, rowData, rowIndex) => {
      return (
         <Text auto scale={1 / 2} font="14px">
            {/* {rowData?.is_rookie} */}
            {getRoleFormatting(value, rowData.is_rookie)}
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

   const unverifiedName = (value, rowData, rowIndex) => {
      return (
         <p
            auto
            scale={1 / 2}
            className={styles.nameSection}
         >
            {value}
         </p>
      )
   }

   const emailText = (value, rowData, rowIndex) => {
      return (
         <p
            auto
            scale={1 / 2}
            className={styles.emailSection}
         >
            {value}
         </p>
      )
   }

   const userActions = (value, rowData, rowIndex) => {
      return (
         <div className={styles.verifyTD}>
            <Text
               auto
               scale={1 / 2}
               className={styles.verifyButton}
               onClick={() => verifyUser(rowData.id)}
            >
               Verify
            </Text>
            <Text
               auto
               scale={1 / 2}
               className={styles.verifyButton}
               onClick={() => deleteUser(rowData.id)}
            >
               Delete
            </Text>
            <Text
               auto
               scale={1 / 2}
               font="14px"
               className={styles.verifyButton}
               onClick={() => {
                  setViewingUser(true)
                  setVisible(true)
                  setRelevantUser(rowData)
               }}
            >
               Edit
            </Text>
         </div>
      )
      }

   const userEmail = (value, rowData, rowIndex) => {
      return (
         <p
            auto
            scale={1 / 2}
         >
            {value}
         </p>
      )
   }

   if (session?.is_verified) {
      return (
         <div className={styles.container}>
            <h1 className={styles.title}>Dashboard</h1>
            {props.unverified_users?.length > 0 && (
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
            )}

            <h2 className={styles.sectionHeading}>Athletes</h2>
            <div className={styles.tableHeader}>
               {/* <div className={styles.sortSection}>
                  <p className={styles.sortTitle}>Sort by</p>
                  <Radio.Group value={state} onChange={handler} scale={1/2}>
                     <Radio value="names">Name</Radio>
                     <Radio value="due">Total Due (descending)</Radio>
                     <Radio value="year">Grad Year</Radio>
                  </Radio.Group>
               </div> */}
            </div>
            <Table auto data={props.verified_users}>
               <Table.Column prop="name" label="Athlete" render={athleteName} width={width_name}/>
               <Table.Column
                  prop="role"
                  label="Role"
                  render={athleteRole}
                  width={width_role}
                  className={styles.roleColumn}
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
                  render={userEmail}
               />
               <Table.Column
                  prop="total_work"
                  label="Extra Minutes"
                  render={cellText}
               >
               </Table.Column>
               {/* <Table.Column
                  prop="total_due"
                  label="Total Due"
                  render={cellMoney}
                  width={width_balance}
               /> */}
            </Table>
         </div>
      )
   } else {
      Router.push("/")
      return <Loading />
   }
}
