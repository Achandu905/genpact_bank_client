import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const RepaymentPage = () => {
  const { loanId } = useParams(); 
  const [paymentAmount, setPaymentAmount] = useState(""); 
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState("");
  const location = useLocation();
  const { dueAmount, nextDueDate, outstandingBalance } = location.state || {};
  const navigate=useNavigate();

  const handlePayment = async () => {
    const paymentData = {
      loanId: loanId,
      dueDate: nextDueDate,
      expectedAmount: dueAmount,
      amountPaid: paymentAmount,
      paymentDate: new Date().toISOString().split("T")[0],
      createdAt:new Date().toISOString().split("T")[0],
      status: "Paid",
      penalty: 0, 
      outstandingBalance: outstandingBalance,
    };

    try {
      
      const response = await axios.post("http://localhost:9192/api/loanRepayment/create", paymentData);
      if(response.status===200){
        setSuccess(`Payment successfully processed!`);
        setTimeout(()=>{
            navigate(`/view-loan-details/${loanId}`)
      },1500)
       
      setError(""); 
      }
      
    } catch (err) {
      setError("Failed to process payment. Please try again later.");
      setSuccess(""); 
      console.error("Error during payment processing:", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Repayment Details</h2>
      <div className="card shadow-lg">
        <div className="card-body">
          <p><strong>Loan ID:</strong> {loanId}</p>
          <p><strong>Next Due Date:</strong> {nextDueDate}</p>
          <p><strong>Outstanding Balance:</strong> ₹{outstandingBalance}</p>
          <p><strong>Due Amount:</strong> ₹{dueAmount}</p>
          <div className="form-group mt-3">
            <label htmlFor="paymentAmount"><strong>Amount to Pay:</strong></label>
            <input
              type="number"
              id="paymentAmount"
              className="form-control"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Enter amount to pay"
            />
          </div>
          <button className="btn btn-primary mt-4" onClick={handlePayment}>
            Submit Payment
          </button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">{success}</div>}
        </div>
      </div>
    </div>
  );
};

export default RepaymentPage;
