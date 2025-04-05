import React from "react";
import { useNavigate } from "react-router-dom"; // React Router hook for navigation

import Layout from "../../layout_components/Layout";
const Loan = () => {
  const navigate = useNavigate(); // Navigation hook

  return (
    <Layout>
      <div className="container mt-5 mb-5">
        <div className="card shadow-lg p-3">
          <div className="card-body">
            <h3 className="card-title text-center mb-4">Loan Services</h3>
            <div className="row">
              {/* Card for View Loans */}
              <div
                className="col-md-6 mb-4"
                onClick={() => navigate("/view-loans")}
                style={{ cursor: "pointer" }}
              >
                <div className="card shadow-sm loan-card">
                  <div className="card-body text-center">
                    <h5 className="card-title text-primary">View Loans</h5>
                    <p className="card-text text-secondary">
                      See your loan details and history.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card for Apply Loan */}
              <div
                className="col-md-6 mb-4"
                onClick={() => navigate("/apply-loan")}
                style={{ cursor: "pointer" }}
              >
                <div className="card shadow-sm loan-card">
                  <div className="card-body text-center">
                    <h5 className="card-title text-success">Apply Loan</h5>
                    <p className="card-text text-secondary">
                      Start your loan application process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Loan;
