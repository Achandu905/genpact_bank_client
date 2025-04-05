import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../../layout_components/Layout";

const ViewLoanDetails = () => {
  const { loanId } = useParams(); // Get loanId from route parameters
  const [loanDetails, setLoanDetails] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [nextDueDate, setNextDueDate] = useState("");
  const [dueAmount, setDueAmount] = useState(null);
  const [installmentNumber, setInstallmentNumber] = useState(1);
  const [outstandingBalance, setOutstandingBalance] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const loanDetailsResponse = await axios.get(
          `http://localhost:9192/api/loan/${loanId}`
        );
        if (loanDetailsResponse.status === 200) {
          setLoanDetails(loanDetailsResponse.data);
          setDueAmount(loanDetailsResponse.data.installmentPerMonth);
        }

        if (loanDetailsResponse.data.status === "Approved") {
          const repaymentsResponse = await axios.get(
            `http://localhost:9192/api/loanRepayment/allLoanRepayments/${loanId}`
          );
          setRepayments(repaymentsResponse.data);

          // Calculate next due date and installment details
          if (repaymentsResponse.data.length > 0) {
            const recentRepayment = repaymentsResponse.data[0];
            const newDueDate = new Date(recentRepayment.due_date);
            newDueDate.setDate(newDueDate.getDate() + 30);
            setNextDueDate(newDueDate.toISOString().split("T")[0]); // Format the date
            setInstallmentNumber(repaymentsResponse.data.length + 1);
            setOutstandingBalance(recentRepayment.outstanding_balance);
            console.log(repaymentsResponse.data);
          } else {
            const approvedDate = new Date(loanDetailsResponse.data.approvedAt);
            approvedDate.setDate(approvedDate.getDate() + 30);
            setNextDueDate(approvedDate.toISOString().split("T")[0]); // Format the
            setOutstandingBalance(loanDetailsResponse.data.loanAmount);
          }
        }
      } catch (err) {
        setError(
          "Failed to fetch loan details or repayments. Please try again later."
        );
      }
    };

    fetchLoanDetails();
  }, [loanId]);

  if (!loanDetails) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  console.log("Due amount : " + dueAmount);
  return (
    <Layout>
      <div className="container mt-5 mb-10">
        <h2 className="text-center mb-4">Loan Details</h2>
        <div className="card shadow-lg mb-4">
          <div className="card-body">
            <p>
              <strong>Amount:</strong> ₹{loanDetails.loanAmount}
            </p>
            <p>
              <strong>Duration:</strong> {loanDetails.loanTenure} months
            </p>
            <p>
              <strong>Status:</strong> {loanDetails.status}
            </p>
            <p>
              <strong>Rate of Interest:</strong> {loanDetails.interestRate}%
            </p>
          </div>
        </div>

        {loanDetails.status === "Approved" && (
          <>
            <h3 className="text-center mt-4">Next Due Details</h3>
            <div className="card shadow-lg mb-4">
              <div className="card-body">
                <p>
                  <strong>Next Due Date:</strong> {nextDueDate}
                </p>
                <p>
                  <strong>Installment Number:</strong> {installmentNumber}
                </p>
                <p>
                  <strong>Due Amount:</strong> ₹
                  {loanDetails.installmentPerMonth}
                </p>
                <p>
                  <strong>Outstanding Balance:</strong> ₹{outstandingBalance}
                </p>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() =>
                    navigate(`/repayment/${loanId}`, {
                      state: { dueAmount, nextDueDate, outstandingBalance },
                    })
                  }
                >
                  Proceed to Pay
                </button>
              </div>
            </div>

            <h3 className="text-center mt-4">Repayment Details</h3>
            {repayments.length > 0 ? (
              <table className="table table-striped table-hover shadow-sm mb-5">
                <thead className="bg-primary text-white">
                  <tr>
                    <th>Installment Number</th>
                    <th>Due Amount</th>
                    <th>Amount Paid</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Penalty</th>
                    <th>Outstanding Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {repayments.map((repayment) => (
                    <tr key={repayment.id} className="align-middle">
                      <td>{repayment.installment_number}</td>
                      <td>₹{repayment.expected_amount}</td>
                      <td>₹{repayment.amount_paid}</td>
                      <td>{repayment.due_date}</td>
                      <td>
                        <span
                          className={`badge ${
                            repayment.status === "Paid"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {repayment.status}
                        </span>
                      </td>
                      <td>
                        {repayment.penalty > 0
                          ? `₹${repayment.penalty}`
                          : "No Penalty"}
                      </td>
                      <td>{repayment.outstanding_balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center mt-4">No repayments available.</div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ViewLoanDetails;
