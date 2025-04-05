import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout_components/Layout";

const ViewLoans = () => {
  const [loans, setLoans] = useState([]); // State to store loans data
  const [error, setError] = useState(""); // State to handle errors
  const savingAccId = 1; // Replace with the appropriate savingAccId
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch loans when the component loads
    const fetchLoans = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9192/api/loan/getCustomerLoans/${savingAccId}`
        );
        console.log(response);
        setLoans(response.data); // Set the loans data into state
      } catch (err) {
        setError("Failed to fetch loans. Please try again later.");
        console.error(err);
      }
    };

    fetchLoans();
  }, [savingAccId]);

  const viewLoanDetails = (loanId) => {
    navigate(`/view-loan-details/${loanId}`); // Navigate to the details page with loanId
  };

  console.log("loans details : "+loans);

  return (
    <Layout>
    <div className="container mt-5">
      <h2 className="text-center mb-4">Your Loans</h2>
      {error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        <table className="table table-striped table-hover shadow-lg">
          <thead className="bg-primary text-white">
            <tr>
              <th>#</th>
              <th>Amount</th>
              <th>Duration (months)</th>
              <th>Status</th>
              <th>Applied At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.length > 0 ? (
              loans.map((loan, index) => (
                <tr key={loan.loan_id} className="align-middle">
                  <td>{index + 1}</td>
                  <td>₹{loan.loan_amount}</td>
                  <td>{loan.loan_tenure}</td>
                  <td>
                    <span
                      className={`badge ${
                        loan.status === "Approved"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </td>
                  <td>{new Date(loan.applied_at).toISOString().split("T")[0]}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => viewLoanDetails(loan.loan_id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No loans available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
    </Layout>
  );
};

export default ViewLoans;
