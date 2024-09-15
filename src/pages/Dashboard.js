
import React, {useState,useEffect} from 'react'
import Header from '../components/Header';
import Cards from "../components/Cards"
// import {Modal} from "antd";
import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome"
import { toast } from 'react-toastify';
import {addDoc,collection,getDocs,query, Transaction} from "firebase/firestore";
import {auth,db} from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import moment from "moment";
import TransactionsTable from '../components/TransactionsTable';
import ChartComponent from '../components/Charts';
import NoTransactions from '../components/NoTransactions/NoTransactions';
function Dashboard() {
  // const transaction=[
  //   {
  //     type:"income",
  //     amount:"1200",
  //     tag:"salary",
  //     name:"income-1",
  //     date:"2023-05-25",
  //   },
  //   {
  //     type:"expense",
  //     amount:"800",
  //     tag:"food",
  //     name:"expense-1",
  //     date:"2023-05-29",
  //   },
  // ]

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModelVisible, setIsExpenseModelVisible] = useState(false);
  const [isIncomeModelVisible, setIsIncomeModelVisible] = useState(false);
  const [income,setIncome]=useState(0);
  const [expense,setExpenses]=useState(0);
  const [totalBalance,setTotalBalance]=useState(0)

  const showExpenseModel = ()=>{
    setIsExpenseModelVisible(true);
  };
  const showIncomeModel = ()=>{
    setIsIncomeModelVisible(true)
  };

  const handleExpenseCancel = ()=>{
    setIsExpenseModelVisible(false);
  };
  const handleIncomeCancel = ()=>{
    setIsIncomeModelVisible(false)
  }

   const onFinish=(values,type) =>{
         
    const newTransaction={
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag:values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
   }

   async function addTransaction(transaction,many){
        try{
          const docRef = await addDoc(
            collection(db, `users/${user.uid}/transactions`),
            transaction
          );
          console.log("Document Written with ID: ",docRef.id);
          if(!many)toast.success("Transaction Added!")
          let newArr = transactions;
          newArr.push(transaction);
          setTransactions(newArr);
          calculateBalance();
        }catch(e){
              console.error("Error adding document: ",e);
              if(!many)  toast.error("Couldn't add transaction");
              
        }
   }

   useEffect(()=>{
       if(user){
        fetchTransactions();
       }
   },[user]);

   useEffect(()=>{
       calculateBalance();
   },[transactions])

   const calculateBalance = ()=>{
      let incomeTotal = 0;
      let expensesTotal=0;

      transactions.forEach((transaction)=>{
        if(transaction.type === "income"){
          incomeTotal +=transaction.amount;
        }else{
          expensesTotal += transaction.amount;
        }
      });

      setIncome(incomeTotal);
      setExpenses(expensesTotal);
      setTotalBalance(incomeTotal - expensesTotal);
   }
  
   async function fetchTransactions(){
    setLoading(true);
    if(user){
      const q = query(collection(db,`users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray=[];
      querySnapshot.forEach((doc)=>{
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log("Transaction Array: ",transactionsArray)
      toast.success("Transactions Fetched!");
     }
     //else{
    //   toast.error("No User!")
    // }
    setLoading(false);
   }
  let sortedTransactions=[...transactions].sort((a,b)=>{
  
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    })

    async function reset() {
      try {
        // Delete all transactions
        const q = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);
        
        const deletePromises = querySnapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);
    
        // Clear local state
        setTransactions([]);
        setIncome(0);
        setExpenses(0);
        setTotalBalance(0);
    
        toast.success("All data has been reset!");
      } catch (e) {
        console.error("Error resetting data: ", e);
        toast.error("Couldn't reset data");
      }
    }
    
  return (
    <div>
      <Header/>
      {loading ? (<p>Loading...</p> ): ( 
      <>
      <Cards   
            income={income}
            expense={expense}
            totalBalance={totalBalance}
             showExpenseModel={showExpenseModel}
             showIncomeModel={showIncomeModel}
             reset={reset}
          
      />
     
        {transactions.length!=0 ? <ChartComponent sortedTransactions={sortedTransactions}
        /> : <NoTransactions/>}

      <AddExpenseModal 
       isExpenseModelVisible={isExpenseModelVisible}
       handleExpenseCancel={handleExpenseCancel}
       onFinish = {onFinish}
      />
      <AddIncomeModal
        isIncomeModelVisible={isIncomeModelVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
      />
      <TransactionsTable 
      transactions={transactions} 
      addTransaction={addTransaction}
      fetchTransactions={fetchTransactions}
      />
        </>
      )}
    </div>

  )
}

export default Dashboard;