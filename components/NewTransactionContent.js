import styles from "../styles/Overlays.module.css"
import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { Input, Button, Modal, Select, Checkbox } from "@geist-ui/core"
import { createTransactionForUser, isTransactionValid} from "../utils"

import Router from "next/router"
import { convertCompilerOptionsFromJson } from "typescript"

export default function NewTransactionContent(props) {
   const { data: session, status } = useSession()
   const [amount, setAmount] = useState()
   const [type, setType] = useState()
   const [description, setDescription] = useState()
   const [applyTo, setApplyTo] = useState(props.uid ? "na" : "all users")
   const [submit, setSubmit] = useState(false)

   const handleDropdown = val => setApplyTo(val)
   const handleTypeDropdown = val => setType(val)
   const handleCheckbox = val => setSubmit(!submit)

   return (
      <div className={styles.container}>
         <Modal.Title className={styles.title} style={{ textTransform: "None" }}>
            New Transaction {props.name ? "for " + props.name : ""}
         </Modal.Title>
         <div className={styles.inputSection}>
            <div className={styles.inputGroup}>
               <Input
                  className={styles.formInput}
                  onChange={(e) => setAmount(e.target.value)}
                  width={"100%"}
               >
                  <b>Amount</b>
               </Input>
            </div>
            <div className={styles.inputGroup}>
               <b className={styles.label}>Type</b>
               <Select
                  placeholder="Select a type"
                  className={styles.inputType}
                  onChange={handleTypeDropdown}
                  width={"100%"}
               >
                  <Select.Option value="Dues">Dues</Select.Option>
                  <Select.Option value="RaR">RaR</Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
               </Select>
            </div>
         </div>
         <div className={styles.inputSection}>
            <Input
               className={styles.formInput}
               onChange={(e) => setDescription(e.target.value)}
               width={"100%"}
            >
               <b className={styles.desc}>Description</b>
            </Input>
         </div>
         {!props.uid && (
            <div className={styles.inputSection}>
               <Select placeholder="Choose one" onChange={handleDropdown} width={"100%"} initialValue={props.uid ? "na" : "all users"}>
                  <Select.Option value="all users">Apply transaction to all users</Select.Option>
                  <Select.Option value="all rookies">Apply transaction to all rookies</Select.Option>
                  <Select.Option value="all varsity">Apply transaction to all varsity</Select.Option>
               </Select>
            </div>
         )}

         {props.uid && session?.role != "admin" && (
            <div className={styles.inputSection}>
               <Checkbox onChange={handleCheckbox} checked={false}>I have turned in a check or venmoed the Treasurer for this transaction</Checkbox>
            </div>
         )}

         <div className={styles.actions}>
            <Button
               passive
               onClick={() => props.setVisible(false)}
               auto
               type="abort"
            >
               Cancel
            </Button>
            <Button
               auto
               type="success"
               onClick={() => {
                  createTransactionForUser(
                     props.uid,
                     parseInt(amount),
                     type,
                     description,
                     applyTo,
                     session.user.name
                  )
               }}
               disabled={!isTransactionValid(amount, type, description) || props.uid && session?.role != "admin" && !submit}
            >
               Submit
            </Button>
         </div>
      </div>
   )
}
