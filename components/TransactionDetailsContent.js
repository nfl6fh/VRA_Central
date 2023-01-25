import styles from "../styles/Overlays.module.css"
import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { Input, Button, Modal, Select } from "@geist-ui/core"
import {
   formatMoney,
   getDateFormatting,
   approveTransaction,
   isTransactionValid,
   deleteTransaction,
   updateTransaction,
} from "../utils"
import Router from "next/router"

export default function NewTransactionContent(props) {
   const { data: session, status } = useSession()
   const [isEditing, setIsEditing] = useState(false)
   const [amount, setAmount] = useState()
   const [isEdited, setIsEdited] = useState(false)
   
   return (
      <div
         className={styles.container}
         onClick={() => console.log("props", props)}
      >
         <div className={styles.container}>
            <Modal.Title style={{ textTransform: "None" }}>
               Transaction {props.name ? "for " + props.name : ""}
            </Modal.Title>
            <div className={styles.inputSection}>
               <div className={styles.inputGroup}>
                  {isEditing ? (
                     <Input
                        className={styles.formInput}
                        onChange={(e) => setAmount(e.target.value)}
                        initialValue={isEdited ? amount : props?.transaction?.amount}
                        width={"100%"}
                     >
                        <b>Amount</b>
                     </Input>
                  ) : (
                     <div>
                        <b className={styles.label}>Amount</b>

                        <p>{formatMoney.format(isEdited ? amount : props?.transaction?.amount)}</p>
                     </div>
                  )}
               </div>
               <div className={styles.inputGroup}>
                  <b className={styles.label}>Type</b>
                  <p>{props?.transaction?.type}</p>
               </div>
               <div className={styles.inputGroup}>
                  <b className={styles.label}>Last updated</b>
                  <p>{getDateFormatting(props?.transaction?.updatedAt)}</p>
               </div>
            </div>
            <div className={styles.inputSection}>
               <div className={styles.inputGroup}>
                  <b className={styles.label}>Description</b>
                  <p>{props?.transaction?.description}</p>
               </div>
            </div>

            <div className={styles.actions}>
            {(props?.transaction?.status === "pending" || session?.role == "admin") && (
                  <div>
                     <Button
                        auto
                        type="abort"
                        onClick={() => {
                           if (isEditing) {
                              setIsEditing(false)
                              //handle cancel
                           } else {
                              setIsEditing(true)
                           }
                        }}
                     >
                        {isEditing ? "Cancel" : "Edit"}
                     </Button>
                     <Button
                        auto
                        type={isEditing ? "success" : "error"}
                        onClick={() => {
                           if (isEditing) {
                              updateTransaction(props?.transaction?.id, parseFloat(amount), session.user.name),
                              setIsEditing(false),
                              setIsEdited(true)
                           } else {
                              deleteTransaction(props?.transaction?.id)
                           }
                        }}
                        disabled={isEditing && !(!isNaN(parseFloat(amount)) && isFinite(amount)) || isEdited}
                     >
                        {isEditing ? "Save" : "Delete"}
                     </Button>
                  </div>
               )}
               {props?.transaction?.status === "pending" && !isEditing && session?.role == "admin" && (
                  <Button
                     auto
                     type="success"
                     onClick={() => {
                        approveTransaction(props?.transaction?.id, session.user.name)
                     }}
                     disabled={isEdited}
                  >
                     Approve
                  </Button>
               )}
            </div>
         </div>
      </div>
   )
}
