import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCommission, setSelectedCommission] = useState(null);

  const [basicPay, setBasicPay] = useState("");
  const [salary, setSalary] = useState(null);
  const [error, setError] = useState("");

  // =====================================================
  // CITY DETAILS
  // =====================================================

  const cityDetails = {
    "X City": {
      hra7: 0.30,
      transportBelow: 1800,
      transportAbove: 3600
    },

    "Y City": {
      hra7: 0.20,
      transportBelow: 900,
      transportAbove: 1800
    },

    "Z City": {
      hra7: 0.10,
      transportBelow: 900,
      transportAbove: 1800
    }
  };


  // =====================================================
  // SELECT CITY
  // =====================================================

  const selectCity = (city) => {
    setSelectedCity(city);
    setSelectedCommission(null);
    setBasicPay("");
    setSalary(null);
    setError("");
  };


  // =====================================================
  // SELECT PAY COMMISSION
  // =====================================================

  const selectCommission = (commission) => {
    setSelectedCommission(commission);
    setBasicPay("");
    setSalary(null);
    setError("");
  };


  // =====================================================
  // BACK BUTTON
  // =====================================================

  const goBack = () => {

    if (selectedCommission !== null) {

      setSelectedCommission(null);
      setBasicPay("");
      setSalary(null);
      setError("");

    } else {

      setSelectedCity(null);
      setBasicPay("");
      setSalary(null);
      setError("");
    }
  };


  // =====================================================
  // SAVE SALARY TO BACKEND
  // =====================================================

  const saveSalaryToBackend = async (result) => {

    try {

      await axios.post(
        "https://salary-calculator-kewu.onrender.com/api/salary",
        {
          city: selectedCity,
          payCommission: selectedCommission,
          basicPay: Number(basicPay),
          finalSalary: result.finalSalary
        }
      );

      console.log("Salary saved successfully");

    } catch (error) {

      console.log(
        "Could not save salary to backend:",
        error.message
      );
    }
  };


  // =====================================================
  // CALCULATE SALARY
  // =====================================================

  const calculateSalary = async () => {

    // Empty input
    if (basicPay === "") {

      setError("Please enter your Basic Pay.");
      setSalary(null);

      return;
    }


    const basic = Number(basicPay);


    // Invalid input
    if (isNaN(basic) || basic <= 0) {

      setError("Please enter a valid Basic Pay.");
      setSalary(null);

      return;
    }


    const city = cityDetails[selectedCity];


    // =================================================
    // 7TH PAY COMMISSION
    // =================================================

    if (selectedCommission === "7th Pay Commission") {

      // HRA
      const hra = basic * city.hra7;


      // DA = 60% of Basic Pay
      const da = basic * 0.60;


      // Transport Allowance
      let transportAllowance;

      if (basic > 23100) {

        transportAllowance = city.transportAbove;

      } else {

        transportAllowance = city.transportBelow;
      }


      // DA on Transport = 60%
      const daOnTransport =
        transportAllowance * 0.60;


      // Final Salary
      const finalSalary =
        basic +
        hra +
        da +
        transportAllowance +
        daOnTransport;


      // Result object
      const result = {

        type: "7th",

        basic: basic,

        hra: hra,
        hraPercentage: city.hra7 * 100,

        da: da,
        daPercentage: 60,

        transportAllowance:
          transportAllowance,

        daOnTransport:
          daOnTransport,

        daTransportPercentage: 60,

        finalSalary: finalSalary
      };


      // Show result
      setSalary(result);

      setError("");


      // Save to MongoDB through backend
      await saveSalaryToBackend(result);

      return;
    }


    // =================================================
    // 8TH PAY COMMISSION
    // =================================================

    if (selectedCommission === "8th Pay Commission") {

      // Basic Pay = 2.8 times
      const increasedBasicPay =
        basic * 2.8;


      // Amount increased
      const increaseAmount =
        increasedBasicPay - basic;


      // HRA = 7.5% of increased Basic Pay
      const hra =
        increasedBasicPay * 0.075;


      // DA = 0%
      const da = 0;


      // =================================================
      // TRANSPORT ALLOWANCE
      // =================================================

      let seventhPayTransport;


      // Check ORIGINAL Basic Pay
      if (basic > 23100) {

        seventhPayTransport =
          city.transportAbove;

      } else {

        seventhPayTransport =
          city.transportBelow;
      }


      // 8th Pay TA = 2 × 7th Pay TA
      const transportAllowance =
        seventhPayTransport * 2;


      // DA on Transport = 0%
      const daOnTransport = 0;


      // Final Salary
      const finalSalary =
        increasedBasicPay +
        hra +
        da +
        transportAllowance +
        daOnTransport;


      // Result object
      const result = {

        type: "8th",

        // Existing Basic Pay
        basic: basic,

        // Increase
        increaseAmount:
          increaseAmount,

        multiplier: 2.8,

        // New Basic Pay
        increasedBasicPay:
          increasedBasicPay,

        // HRA
        hra: hra,

        hraPercentage: 7.5,

        // DA
        da: da,

        daPercentage: 0,

        // 7th Pay TA
        seventhPayTransport:
          seventhPayTransport,

        // 8th Pay TA
        transportAllowance:
          transportAllowance,

        // DA on Transport
        daOnTransport:
          daOnTransport,

        daTransportPercentage: 0,

        // Final Salary
        finalSalary:
          finalSalary
      };


      // Show result
      setSalary(result);

      setError("");


      // Save to MongoDB through backend
      await saveSalaryToBackend(result);
    }
  };


  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (amount) => {

    return amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="app">

      {/* Background decorative circles */}

      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>


      <div className="content">


        {/* =================================================
            HOME PAGE
        ================================================= */}

        {selectedCity === null && (

          <>

            <div className="badge">
              ✨ Smart Salary Calculator
            </div>


            <h1>
              Pay Commission

              <span>
                Salary Calculator
              </span>
            </h1>


            <p className="subtitle">
              Calculate your salary based on the
              7th & 8th Pay Commission
            </p>


            <div className="city-card">

              <h2>
                Choose Your City
              </h2>


              <p className="description">
                Select your city to continue with
                the salary calculation
              </p>


              <div className="city-container">


                {/* X CITY */}

                <button
                  className="city-button x-city"
                  onClick={() =>
                    selectCity("X City")
                  }
                >

                  <span className="city-icon">
                    🏙️
                  </span>


                  <span>

                    <strong>
                      X City
                    </strong>

                    <small>
                      30% HRA
                    </small>

                  </span>


                  <span className="arrow">
                    →
                  </span>

                </button>


                {/* Y CITY */}

                <button
                  className="city-button y-city"
                  onClick={() =>
                    selectCity("Y City")
                  }
                >

                  <span className="city-icon">
                    🌆
                  </span>


                  <span>

                    <strong>
                      Y City
                    </strong>

                    <small>
                      20% HRA
                    </small>

                  </span>


                  <span className="arrow">
                    →
                  </span>

                </button>


                {/* Z CITY */}

                <button
                  className="city-button z-city"
                  onClick={() =>
                    selectCity("Z City")
                  }
                >

                  <span className="city-icon">
                    🌇
                  </span>


                  <span>

                    <strong>
                      Z City
                    </strong>

                    <small>
                      10% HRA
                    </small>

                  </span>


                  <span className="arrow">
                    →
                  </span>

                </button>

              </div>

            </div>


            {/* INFO SECTION */}

            <div className="info-section">

              <div className="info-card">

                <div className="info-icon">
                  💰
                </div>

                <div>

                  <h3>
                    Easy Calculation
                  </h3>

                  <p>
                    Enter your basic pay and get
                    your salary instantly.
                  </p>

                </div>

              </div>


              <div className="info-card">

                <div className="info-icon">
                  ⚡
                </div>

                <div>

                  <h3>
                    Instant Result
                  </h3>

                  <p>
                    Fast and accurate salary
                    calculation.
                  </p>

                </div>

              </div>


              <div className="info-card">

                <div className="info-icon">
                  📊
                </div>

                <div>

                  <h3>
                    Pay Commission
                  </h3>

                  <p>
                    Compare 7th and 8th Pay
                    Commission salaries.
                  </p>

                </div>

              </div>

            </div>

          </>
        )}


        {/* =================================================
            COMMISSION SELECTION PAGE
        ================================================= */}

        {selectedCity !== null &&
          selectedCommission === null && (

          <div className="commission-page">

            <button
              className="back-button"
              onClick={goBack}
            >
              ← Back to Cities
            </button>


            <div className="badge">
              📍 {selectedCity}
            </div>


            <h1>

              Select

              <span>
                Pay Commission
              </span>

            </h1>


            <p className="subtitle">
              Choose the pay commission you want
              to calculate
            </p>


            <div className="commission-container">


              {/* 7TH PAY */}

              <button
                className="commission-card"
                onClick={() =>
                  selectCommission(
                    "7th Pay Commission"
                  )
                }
              >

                <div className="commission-icon">
                  7️⃣
                </div>


                <div>

                  <h2>
                    7th Pay Commission
                  </h2>

                  <p>
                    Calculate salary using 7th
                    Pay Commission rules.
                  </p>

                </div>


                <span className="commission-arrow">
                  →
                </span>

              </button>


              {/* 8TH PAY */}

              <button
                className="commission-card"
                onClick={() =>
                  selectCommission(
                    "8th Pay Commission"
                  )
                }
              >

                <div className="commission-icon">
                  8️⃣
                </div>


                <div>

                  <h2>
                    8th Pay Commission
                  </h2>

                  <p>
                    Calculate salary using 8th
                    Pay Commission rules.
                  </p>

                </div>


                <span className="commission-arrow">
                  →
                </span>

              </button>

            </div>

          </div>
        )}


        {/* =================================================
            CALCULATOR PAGE
        ================================================= */}

        {selectedCommission !== null && (

          <div className="calculator-page">


            {/* BACK BUTTON */}

            <button
              className="back-button"
              onClick={goBack}
            >
              ← Back
            </button>


            <div className="badge">
              📍 {selectedCity}
            </div>


            <h1>

              {selectedCommission}

              <span>
                Salary Calculator
              </span>

            </h1>


            <p className="subtitle">
              Enter your Basic Pay to calculate
              your salary
            </p>


            {/* 8TH PAY INFORMATION */}

            {selectedCommission ===
              "8th Pay Commission" && (

              <div className="calculator-card">

                <h2>
                  📈 Basic Pay Revision
                </h2>


                <p className="description">

                  Your existing Basic Pay will be
                  multiplied by

                  <strong>
                    {" "}2.8 times
                  </strong>

                  {" "}under the 8th Pay Commission.

                </p>

              </div>
            )}


            {/* INPUT CARD */}

            <div className="calculator-card">

              <div className="input-section">

                <label>
                  Existing Basic Pay
                </label>


                <div className="input-wrapper">

                  <span>
                    ₹
                  </span>


                  <input
                    type="number"
                    placeholder="Enter Basic Pay"
                    value={basicPay}
                    onChange={(e) =>
                      setBasicPay(e.target.value)
                    }
                  />

                </div>

              </div>


              <button
                className="calculate-button"
                onClick={calculateSalary}
              >
                Calculate Salary
              </button>


              {error && (

                <p className="error-message">
                  ⚠️ {error}
                </p>

              )}

            </div>


            {/* =================================================
                7TH PAY RESULT
            ================================================= */}

            {salary &&
              salary.type === "7th" && (

              <div className="result-card">

                <div className="result-header">

                  <div>

                    <h2>
                      Salary Breakdown
                    </h2>

                    <p>
                      {selectedCity}
                      {" • "}
                      7th Pay Commission
                    </p>

                  </div>


                  <div className="result-icon">
                    💰
                  </div>

                </div>


                {/* BASIC PAY */}

                <div className="salary-row">

                  <span>
                    Basic Pay
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      salary.basic
                    )}
                  </strong>

                </div>


                {/* HRA */}

                <div className="salary-row">

                  <span>
                    HRA ({salary.hraPercentage}%)
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      salary.hra
                    )}
                  </strong>

                </div>


                {/* DA */}

                <div className="salary-row">

                  <span>
                    Dearness Allowance (60%)
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      salary.da
                    )}
                  </strong>

                </div>


                {/* TA */}

                <div className="salary-row">

                  <span>
                    Transport Allowance
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      salary.transportAllowance
                    )}
                  </strong>

                </div>


                {/* DA ON TA */}

                <div className="salary-row">

                  <span>
                    DA on Transport (60%)
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      salary.daOnTransport
                    )}
                  </strong>

                </div>


                {/* FINAL */}

                <div className="final-salary">

                  <span>
                    Final Salary
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      salary.finalSalary
                    )}
                  </strong>

                </div>

              </div>
            )}


            {/* =================================================
                8TH PAY RESULT
            ================================================= */}

            {salary &&
              salary.type === "8th" && (

              <div className="result-card">

                <div className="result-header">

                  <div>

                    <h2>
                      8th Pay Salary Breakdown
                    </h2>

                    <p>
                      {selectedCity}
                      {" • "}
                      8th Pay Commission
                    </p>

                  </div>


                  <div className="result-icon">
                    📈
                  </div>

                </div>


                {/* EXISTING BASIC */}

                <div className="salary-row">

                  <span>
                    Existing Basic Pay
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      salary.basic
                    )}
                  </strong>

                </div>


                {/* REVISED BASIC */}

                <div className="salary-row">

                  <span>
                    Revised Basic Pay (2.8×)
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      salary.increasedBasicPay
                    )}
                  </strong>

                </div>


                {/* HRA */}

                <div className="salary-row">

                  <span>
                    HRA (7.5%)
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      salary.hra
                    )}
                  </strong>

                </div>


                {/* DA */}

                <div className="salary-row">

                  <span>
                    Dearness Allowance (0%)
                  </span>

                  <strong>
                    ₹0.00
                  </strong>

                </div>


                {/* TA */}

                <div className="salary-row">

                  <span>
                    Transport Allowance (2× 7th Pay)
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      salary.transportAllowance
                    )}
                  </strong>

                </div>


                {/* DA ON TA */}

                <div className="salary-row">

                  <span>
                    DA on Transport (0%)
                  </span>

                  <strong>
                    ₹0.00
                  </strong>

                </div>


                {/* FINAL */}

                <div className="final-salary">

                  <span>
                    Final Salary
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      salary.finalSalary
                    )}
                  </strong>

                </div>

              </div>
            )}

          </div>
        )}


        {/* FOOTER */}

        <footer>
          © 2026 Pay Commission Salary Calculator
        </footer>

      </div>

    </div>
  );
}

export default App;