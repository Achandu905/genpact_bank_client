import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout_components/Layout";

const ManageLoansDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get(`http://localhost:9192/api/loan/getBranchLoans/${1}`);
        if (response.status === 200) {
          setLoans(response.data);
        } else {
          setError("Failed to fetch loans. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching loans:", err);
        setError("Unable to connect to the server.");
      }
    };

    fetchLoans();
  }, []);

  const handleViewDetails = (loanId) => {
    navigate(`/manage-loan/${loanId}`);
  };

  return (
    <Layout>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Manage Loans Dashboard</h2>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        {!error && loans.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover table-striped table-bordered custom-table">
              <thead className="table-dark">
                <tr>
                  <th>Loan ID</th>
                  <th>Loan Amount</th>
                  <th>Loan Tenure</th>
                  <th>Interest Rate</th>
                  <th>Applied At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.loanId}>
                    <td>{loan.loan_id}</td>
                    <td>{loan.loan_amount}</td>
                    <td>{loan.loan_tenure}</td>
                    <td>{loan.interest_rate}%</td>
                    <td>{new Date(loan.applied_at).toISOString().split("T")[0]}</td>
                    <td>{loan.status}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleViewDetails(loan.loan_id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !error && <div className="text-center">No loans available.</div>
        )}
      </div>
    </Layout>
  );
};

export default ManageLoansDashboard;
