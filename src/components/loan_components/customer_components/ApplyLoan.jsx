import React, { useState } from "react";
import axios from "axios"; // Import axios for API calls
import Layout from "../../layout_components/Layout";

const ApplyLoan = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [autoPay, setAutoPay] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleTenureChange = (e) => {
    const tenure = parseInt(e.target.value, 10);

    setLoanTenure(tenure);

    // Set interest rate based on loan tenure
    if (tenure < 12) {
      setInterestRate(9); // 9% for less than 12 months
    } else if (tenure >= 12 && tenure <= 24) {
      setInterestRate(8); // 8% for 13–24 months
    } else {
      setInterestRate(7); // Default value for other tenures
    }
  };

  const handleToggle = () => {
    setAutoPay(!autoPay);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (loanAmount > 0 || loanTenure > 0) {
      const loanData = {
        loanAmount,
        loanTenure,
        interestRate,
        autoPay,
        bmId: 1,
        status: "Pending",
        loanAccId: 5,
        totalInstallments: loanTenure,
        savingsAccId: 1,
      };

      console.log(loanData);
      try {
        const response = await axios.post(
          "http://localhost:9192/api/loan/create",
          loanData
        );
        if (response.status === 200) {
          setResponseMessage("Loan submitted successfully!");
        } else {
          setResponseMessage("Loan submission failed. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting loan:", error);
        setResponseMessage(
          "Loan submission failed. Please check your connection or server status."
        );
      }
    } else {
      setLoanAmount("");
      setLoanTenure("");
      setInterestRate("");
      alert("Enter valid details");
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="card shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Apply for a Loan</h2>
            <form onSubmit={onSubmitHandler}>
              {/* Loan Amount Field */}
              <div className="mb-3">
                <label htmlFor="loanAmount" className="form-label">
                  Loan Amount
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="loanAmount"
                  placeholder="Enter loan amount"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                />
              </div>

              {/* Loan Tenure Field */}
              <div className="mb-3">
                <label htmlFor="loanTenure" className="form-label">
                  Loan Tenure (in months)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="loanTenure"
                  placeholder="Enter loan tenure"
                  value={loanTenure}
                  onChange={handleTenureChange}
                />
              </div>

              {/* Interest Rate Field */}
              <div className="mb-3">
                <label htmlFor="interestRate" className="form-label">
                  Interest Rate per annum (%)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="interestRate"
                  value={interestRate}
                  disabled // Interest rate is always non-editable
                />
              </div>

              {/* Auto Pay Toggle */}
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <label className="form-label">Auto Pay</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="autoPayToggle"
                    checked={autoPay}
                    onChange={handleToggle}
                  />
                  <label className="form-check-label" htmlFor="autoPayToggle">
                    {autoPay ? "Enabled" : "Disabled"}
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-success w-100">
                Submit Application
              </button>
            </form>

            {/* Response Message */}
            {responseMessage && (
              <div className="alert mt-3 alert-info text-center">
                {responseMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApplyLoan;
