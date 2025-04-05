
import { Route, Routes } from 'react-router-dom';
import Loan from './components/loan_components/customer_components/Loan';
import ViewLoans from './components/loan_components/customer_components/ViewLoans';
import ViewLoanDetails from './components/loan_components/customer_components/ViewLoanDetails';
import ManageLoansDashboard from './components/loan_components/manager_components/ManageLoansDashboard';
import "./styles.css";
import RepaymentPage from './components/loan_components/customer_components/RepaymentPage';
import ManageLoan from './components/loan_components/manager_components/ManageLoan';
import ApplyLoan from './components/loan_components/customer_components/ApplyLoan';


function App() {
  return (
    <div >

      <Routes>

     <Route path='/loan' element={<Loan/>}/>
     <Route path="/view-loans" element={<ViewLoans/>} />
     <Route path="/apply-loan" element={<ApplyLoan/>} />
     <Route path="/view-loan-details/:loanId" element={<ViewLoanDetails/>} />
     <Route path="/manage-loans-dashboard" element={<ManageLoansDashboard/>}/>
     <Route path="/repayment/:loanId" element={<RepaymentPage/>}/>
     <Route path='/manage-loan/:loanId' element={<ManageLoan/>}/>


      </Routes>
     
    </div>
  );
}

export default App;
