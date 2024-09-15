import React from 'react'
import transactions from "../../assets/transactions.svg"
function NoTransactions() {
  return (
    <div
    style={{

        display:"flex",
        justifyContent: "space-between",
        width:"100%",
        flexDirection:"column",
        marginBottom:"2rem",
        alignItems:"center",
      }}
    >
    <img src={transactions} style={{width:"400px",margin:"4rem"}}/>
    <p style={{textAlign:"center", fontSize:"1.2rem"}}>
        You Have No Transactions Currently</p>
    </div>
  )
}

export default NoTransactions