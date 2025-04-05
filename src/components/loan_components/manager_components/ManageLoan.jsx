import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "../../layout_components/Layout";

const ManageLoan = () => {
  const { loanId } = useParams(); // Extract loanId from the route
  const [loanDetails, setLoanDetails] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [repaymentDetails, setRepaymentDetails] = useState([]); // State to store repayment details
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch loan details
        const loanResponse = await axios.get(
          `http://localhost:9192/api/loan/${loanId}`
        );
        if (loanResponse.status === 200) {
          setLoanDetails(loanResponse.data);
          // Fetch repayment details if loan is approved
          if (loanResponse.data.status === "Approved") {
            const repaymentResponse = await axios.get(
              `http://localhost:9192/api/loanRepayment/allLoanRepayments/${loanId}`
            );
            if (repaymentResponse.status === 200) {
              setRepaymentDetails(repaymentResponse.data);
            } else {
              setError("Failed to fetch repayment details.");
            }
          }
        } else {
          setError("Failed to fetch loan details.");
        }

        // Fetch customer details
        const customerResponse = await axios.get(
          `http://localhost:9192/api/loan/getCustomerDetails/${loanResponse.data.savingsAccId}`
        );
        if (customerResponse.status === 200) {
          setCustomerDetails(customerResponse.data);
        } else {
          setError("Failed to fetch customer details.");
        }
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Unable to connect to the server.");
      }
    };

    fetchDetails();
  }, [loanId]);

  const handleStatusChange = async (status) => {
    try {
      const response = await axios.put(
        `http://localhost:9192/api/loan/manageStatus/${loanId}?status=${status}`
      );
      if (response.status === 200) {
        alert("Loan status updated successfully.");
        navigate("/manage-loans-dashboard"); // Navigate back to dashboard after successful update
      } else {
        alert("Failed to update loan status. Please try again.");
      }
    } catch (err) {
      console.error("Error updating loan status:", err);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Manage Loan</h2>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        {loanDetails ? (
          <>
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                Loan Details
              </div>
              <div className="card-body">
                <p>
                  <strong>Loan Amount:</strong> {loanDetails.loanAmount}
                </p>
                <p>
                  <strong>Loan Tenure:</strong> {loanDetails.loanTenure} months
                </p>
                <p>
                  <strong>Interest Rate:</strong> {loanDetails.interestRate}%
                </p>
                <p>
                  <strong>Installment Per Month:</strong>{" "}
                  {loanDetails.installmentPerMonth}
                </p>
                <p>
                  <strong>Applied At:</strong> {loanDetails.appliedAt}
                </p>
                <p>
                  <strong>Status:</strong> {loanDetails.status}
                </p>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                Customer Details
              </div>
              <div className="card-body">
                <p>
                  <strong>Customer Name:</strong> {customerDetails?.full_name}
                </p>
                <p>
                  <strong>Contact:</strong> {customerDetails?.phone}
                </p>
                <p>
                  <strong>Email:</strong> {customerDetails?.email}
                </p>
                <p>
                  <strong>Address:</strong> {customerDetails?.address}
                </p>
              </div>
            </div>

            {loanDetails.status === "Pending" ? (
              <div className="text-center">
                <button
                  className="btn btn-success me-3"
                  onClick={() => handleStatusChange("Approved")}
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleStatusChange("Rejected")}
                >
                  Reject
                </button>
              </div>
            ) : loanDetails.status === "Approved" &&
              repaymentDetails.length > 0 ? (
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  Repayment Details
                </div>
                <div className="card-body">
                  <table className="table table-hover table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>Repayment ID</th>
                        <th>Due Amount</th>
                        <th>Due Date</th>
                        <th>Paid Amount</th>
                        <th>Payment Date</th> 
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repaymentDetails.map((repayment) => (
                        <tr key={repayment.repayment_id}>
                          <td>{repayment.repayment_id}</td>
                          <td>{repayment.expected_amount}</td>
                          <td>
                            {
                              (repayment.due_date)
                                
                            }
                          </td>
                          <td>{repayment.amount_paid}</td>
                          <td>{new Date(repayment.payment_date).toISOString().split("T")[0]}</td>
                          <td>{repayment.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center">No repayment details available.</div>
            )}
          </>
        ) : (
          !error && <div className="text-center">Loading...</div>
        )}
      </div>
    </Layout>
  );
};

export default ManageLoan;
