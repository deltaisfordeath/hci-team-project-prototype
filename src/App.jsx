import { useRef, useState, useEffect } from "react";
import { phones, addOns as mockAddons, insertPaymentMethod } from "./mockData";
import "./App.css";

const minDate = new Date(new Date().setDate(new Date().getDate() + 1))
  .toISOString()
  .split("T")[0];

function lateReturnPolicy(phone) {
  return {
    title: "Late Return Policy",
    body: `Your original payment method will automatically be charged at the following rates: <div>Daily: $${phone.rates.Daily}</div><div>Weekly: $${phone.rates.Weekly}</div><div>Monthly: $${phone.rates.Monthly}</div> Plus a $50 late fee for each week the phone is not returned past the return date.`,
  };
}

function calculateTotalDays(start, end) {
  const M_PER_DAY = 1000 * 60 * 60 * 24;

  start = new Date(start);
  end = new Date(end);

  const utcStart = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

  const diff = (utcEnd - utcStart) / M_PER_DAY;

  return Math.round(diff) + 1;
}

function getRentalPeriods(totalDays) {
  const MONTH_DURATION = 30;
  const WEEK_DURATION = 7;

  let remaining = totalDays;

  const months = Math.floor(remaining / MONTH_DURATION);
  remaining %= MONTH_DURATION;

  const weeks = Math.floor(remaining / WEEK_DURATION);
  remaining %= WEEK_DURATION;

  const days = remaining;

  return { months, weeks, days };
}

function getRentalPrice(phone, returnDate, rentalDate = null) {
  if (!rentalDate) rentalDate = new Date();

  const { days, weeks, months } = getRentalPeriods(
    calculateTotalDays(rentalDate, returnDate)
  );

  const rentalPrice =
    days * phone.rates.Daily +
    weeks * phone.rates.Weekly +
    months * phone.rates.Monthly;

  return rentalPrice;
}

function HelpText({ page }) {
  return (
    <div className={`help-text ${page === "welcome" ? "welcome-text" : ""}`}>
      {"Need help? Call 1-800-123-4567 (24/7 Support)"}
    </div>
  );
}

function Welcome({ navigate }) {
  return (
    <div className="container welcome-container">
      <div>
        <h1>Welcome!</h1>
        <h2>Phones for Every Destination!</h2>
      </div>
      <div className="button-group">
        <button onClick={() => navigate("demo")}>Start Rental!</button>
        <button onClick={() => navigate("return")}>Rental Return</button>
        <button onClick={() => navigate("tutorial")}>Watch How it Works</button>
      </div>
    </div>
  );
}

function Demo({ phone, navigate }) {
  return (
    <div className="container demo-container">
      <h2>{`Rent the ${phone.name} for your trip!`}</h2>
      <div className="demo-video-container"></div>
      <div className="button-group button-group-horizontal">
        <button onClick={() => navigate("rental-options")}>
          See Other Options
        </button>
        <button onClick={() => navigate("checkout")}>Rent This Phone</button>
      </div>
    </div>
  );
}

function RentalOptions({
  clearAddons,
  phones,
  phone,
  returnDate,
  setReturnDate,
  setPhone,
  navigate,
}) {
  const containerRef = useRef();

  const { days, weeks, months } = getRentalPeriods(
    calculateTotalDays(new Date(), returnDate)
  );

  function PhoneList() {
    return phones.map((p) => (
      <div
        key={p.name}
        onClick={(e) => {
          if (p.name !== phone.name) {
            e.stopPropagation();
            clearAddons();
            setPhone(p);
          }
        }}
        className={`phone-container ${p.name === phone.name ? "selected" : ""}`}
      >
        <h3>{p.name}</h3>

        <div>{p.description}</div>

        <div>
          Rental Price:&nbsp;
          <span style={{ fontWeight: "bold" }}>
            $
            {days * p.rates.Daily +
              weeks * p.rates.Weekly +
              months * p.rates.Monthly}
          </span>
        </div>
        <div className="phone-button-group button-group button-group-horizontal">
          <button
            className="btn-small"
            onClick={(e) => {
              if (phone.name !== p.name) {
                e.stopPropagation();
                clearAddons();
                setPhone(p);
              }
              navigate("demo");
            }}
          >
            Demo
          </button>
          <button
            className="btn-small"
            onClick={(e) => {
              if (phone.name !== p.name) {
                e.stopPropagation();
                clearAddons();
                setPhone(p);
              }
              navigate("add-ons");
            }}
          >
            Add-Ons
          </button>
        </div>
      </div>
    ));
  }

  return (
    <div className="container rental-options-container">
      <h2>Choose A Phone</h2>
      <label htmlFor="return-date-picker">
        Return Date:&nbsp;
        <input
          id="return-date-picker"
          type="date"
          onFocus={(e) => e.target.showPicker()}
          min={minDate}
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />
      </label>
      <div ref={containerRef} className="phone-list-container">
        <PhoneList />
      </div>
      <div className="button-group button-group-horizontal">
        <button onClick={() => navigate("demo")}>Back</button>
        <button onClick={() => navigate("checkout")}>Checkout</button>
      </div>
    </div>
  );
}

function AddOns({ phone, addOns, updateAddons, navigate }) {
  return (
    <div className="container add-ons-container">
      <h2>Choose Accessories and Service for Your {phone.name}</h2>
      {addOns.map((addOn) => (
        <div className="add-on-container" key={addOn.name}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              className="add-on-icon"
              style={{ backgroundImage: `url(./img/${addOn.img})` }}
            ></div>
            <div className="add-on-name">{addOn.name}</div>
          </div>

          <div className="add-on-description">{addOn.desc}</div>
          <div className="add-on-select">
            <label>
              ${addOn.price}
              <input
                type="checkbox"
                name={addOn.name}
                id={addOn.name}
                onChange={(e) => updateAddons(e, addOn.name)}
                checked={addOn.selected}
              />
            </label>
          </div>
        </div>
      ))}
      <div className="button-group button-group-horizontal">
        <button onClick={() => navigate("rental-options")}>
          Pick Another Phone
        </button>
        <button onClick={() => navigate("checkout")}>Checkout</button>
      </div>
    </div>
  );
}

function Tutorial({ navigate, prevPage }) {
  const [currentSegment, setCurrentSegment] = useState(0);
  const segmentText = [
    "Choosing a Phone",
    "Payment Methods",
    "Collecting Items",
    "Returning Items",
  ];
  return (
    <div className="container flex-container tutorial-container">
      <h2>How It Works!</h2>
      <div
        onClick={() => setCurrentSegment((s) => s - 1)}
        className={`left-arrow ${currentSegment === 0 ? "hidden" : ""}`}
      ></div>

      <div className="progress-bar">
        <div>
          Choose Phone
          <div
            onClick={() => setCurrentSegment(0)}
            className={`progress-segment ${
              currentSegment === 0 ? "current-segment" : ""
            }`}
          ></div>
        </div>
        <div>
          Pay
          <div
            onClick={() => setCurrentSegment(1)}
            className={`progress-segment ${
              currentSegment === 1 ? "current-segment" : ""
            }`}
          ></div>
        </div>
        <div>
          Pick Up
          <div
            onClick={() => setCurrentSegment(2)}
            className={`progress-segment ${
              currentSegment === 2 ? "current-segment" : ""
            }`}
          ></div>
        </div>
        <div>
          Return
          <div
            onClick={() => setCurrentSegment(3)}
            className={`progress-segment ${
              currentSegment === 3 ? "current-segment" : ""
            }`}
          ></div>
        </div>
      </div>
      <div
        onClick={() => setCurrentSegment((s) => s + 1)}
        className={`right-arrow ${currentSegment === 3 ? "hidden" : ""}`}
      ></div>

      <div className="tutorial-video-container">
        <div className="tutorial-video">{segmentText[currentSegment]}</div>
      </div>
      <div className="button-group">
        <button onClick={() => navigate(prevPage)}>Back</button>
      </div>
    </div>
  );
}

function Checkout({
  phone,
  returnDate,
  addOns,
  setReturnDate,
  updateAddons,
  setModalContent,
  navigate,
  prevPage,
}) {
  const rentalPrice = getRentalPrice(phone, returnDate);
  const addOnsPrice = addOns.reduce((acc, curr) => {
    return acc + (curr.selected ? curr.price : 0);
  }, 0);
  const totalPrice = rentalPrice + addOnsPrice;
  const [agreedTos, setAgreedTos] = useState(false);

  const { days, weeks, months } = getRentalPeriods(
    calculateTotalDays(new Date(), returnDate)
  );

  return (
    <div className="container checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-layout">
        <div className="checkout-summary">
          <div>Model: {phone.name}</div>
          <label htmlFor="return-date-picker">
            Return Date:&nbsp;
            <input
              id="return-date-picker"
              type="date"
              onFocus={(e) => e.target.showPicker()}
              min={minDate}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </label>
          {!!months && (
            <div>
              {months} {months > 1 ? "months" : "month"} @ $
              {phone.rates.Monthly}/month: ${phone.rates.Monthly * months}
            </div>
          )}
          {!!weeks && (
            <div>
              {weeks} {weeks > 1 ? "weeks" : "week"} @ ${phone.rates.Weekly}
              /week: ${phone.rates.Weekly * weeks}
            </div>
          )}
          {!!days && (
            <div>
              {days} {days > 1 ? "days" : "day"} @ ${phone.rates.Daily}
              /day: ${phone.rates.Daily * days}
            </div>
          )}
          <hr />
          <div style={{ fontWeight: "bold" }}>
            Phone Subtotal: ${rentalPrice}
          </div>
          <br />
          <div>Add-Ons:</div>
          {addOns.map((a) => (
            <div key={a.name}>
              <label>
                <input
                  style={{ width: "unset", height: "unset" }}
                  type="checkbox"
                  name={a.name}
                  id={a.name}
                  checked={a.selected}
                  onChange={(e) => updateAddons(e, a.name)}
                />
                {a.name} ${a.price}
              </label>
            </div>
          ))}
          <div style={{ fontWeight: "bold" }}>
            Add-Ons Subtotal: ${addOnsPrice}
          </div>
          <br />
          <div style={{ fontWeight: "bold", fontSize: "1.2em" }}>
            <span style={{ color: "green" }}>Grand Total: </span>${totalPrice}
          </div>
        </div>
        <div className="checkout-payment">
          <h4>Select Payment Method</h4>
          <div className="payment-method-grid">
            <div
              onClick={() => setModalContent(insertPaymentMethod)}
              className="payment-button"
            >
              Debit
            </div>
            <div
              onClick={() => setModalContent(insertPaymentMethod)}
              className="payment-button"
            >
              Credit
            </div>
            <div
              onClick={() => setModalContent(insertPaymentMethod)}
              className="payment-button"
            >
              GPay
            </div>
            <div
              onClick={() => setModalContent(insertPaymentMethod)}
              className="payment-button"
            >
              <img src="./img/apple.png" alt="" />
              Pay
            </div>
          </div>
          <label>
            Email
            <br />
            <input type="text" />
          </label>
          <div className="tos-container">
            <input
              type="checkbox"
              name="tos"
              id="tos"
              checked={agreedTos}
              onChange={(e) => setAgreedTos(e.target.checked)}
            />
            <span className="tos-text">
              I agree to the terms of the{" "}
              <span
                className="tos-link"
                onClick={() => setModalContent(lateReturnPolicy(phone))}
              >
                Late Return Policy
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="button-group button-group-horizontal">
        <button onClick={() => navigate(prevPage)}>Back</button>
        <button onClick={() => navigate("tutorial")}>How It Works</button>
        <button disabled={!agreedTos} onClick={() => navigate("success")}>
          Continue
        </button>
      </div>
    </div>
  );
}

function Success({ navigate }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("welcome");
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className="container flex-container">
      <br />
      <h2>Success!</h2>
      <br />
      <h2>Your phone and accessories are on the way!</h2>
      <br />
      <h2>Enjoy your trip!</h2>
      <br />
      <br />
      <div className="airplane-image"></div>
      <br />
      <br />
      <button onClick={() => navigate("welcome")}>Exit</button>
    </div>
  );
}

function Return({ navigate, setModalContent }) {
  const returnCodeInput = {
    title: "Input Return Code",
    body: `<div>
        <div>Please enter the return code on your rental phone.</div>
        <br />
        <div><label>Return Code: <input></input></label></div>
        <br />
        <button id="return-code-button">Submit</button>
        </div>`,
  };

  return (
    <div className="container flex-container">
      <h2>Scan Your QR Code to Begin</h2>
      <br />
      <div className="flex-container">
        <div
          style={{ backgroundImage: "none" }}
          className="demo-video-container"
        >
          <div className="tutorial-video">Place phone under scanner</div>
        </div>
        <div style={{ maxWidth: "70%", marginBottom: "0.5em" }}>
          <h3 style={{ color: "red" }}>
            Error reading QR code. Hold the phone steady and closer to the
            scanner, or input return code manually.
          </h3>
        </div>
      </div>
      <div className="button-group button-group-horizontal">
        <button onClick={() => navigate("welcome")}>Back</button>
        <button onClick={() => setModalContent(returnCodeInput)}>
          Enter Code
        </button>
      </div>
    </div>
  );
}

function ReturnSummary({ phone, addOns, navigate, setModalContent }) {
  function addDays(date, numDays) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
  }

  const today = new Date();
  const dueDate = addDays(today, -9);
  const rentalDate = addDays(dueDate, -12);

  const { days, weeks, months } = getRentalPeriods(
    calculateTotalDays(dueDate, today)
  );

  const rentalPrice = getRentalPrice(phone, dueDate, rentalDate);
  const addOnsPrice = addOns.slice(0, 2).reduce((acc, curr) => {
    return acc + curr.price;
  }, 0);
  const totalPrice = rentalPrice + addOnsPrice;

  const latePrice = getRentalPrice(phone, today, dueDate);

  const lateWeeks = Math.ceil(calculateTotalDays(dueDate, today) / 7);
  const lateFees = lateWeeks * 50;

  return (
    <div
      style={{ position: "relative" }}
      className="container checkout-container"
    >
      <h2>Return Summary</h2>
      <br />
      <div className="checkout-layout">
        <div className="checkout-summary">
          <div>Model: {phone.name}</div>
          <div>Rental Date: {rentalDate.toLocaleDateString()}</div>
          <div>Due Date: {dueDate.toLocaleDateString()}</div>
          <div style={today > dueDate ? { color: "red" } : {}}>
            Current Date: {today.toLocaleDateString()}
          </div>
          <div style={{ fontWeight: "bold" }}>
            Phone Subtotal: ${rentalPrice}
          </div>
          <br />
          <div>Add-Ons:</div>
          {addOns.slice(0, 2).map((a) => (
            <div key={a.name}>
              {a.name} ${a.price}
            </div>
          ))}
          <div style={{ fontWeight: "bold" }}>
            Add-Ons Subtotal: ${addOnsPrice}
          </div>
          <br />
          <div style={{ fontWeight: "bold", fontSize: "1.2em" }}>
            <span style={{ color: "green" }}>Amount Paid: </span>${totalPrice}
          </div>
        </div>
        <div className="checkout-summary">
          <div>Late Charges</div>
          {!!months && (
            <div>
              {months} {months > 1 ? "months" : "month"} @ $
              {phone.rates.Monthly}/month: ${phone.rates.Monthly * months}
            </div>
          )}
          {!!weeks && (
            <div>
              {weeks} {weeks > 1 ? "weeks" : "week"} @ ${phone.rates.Weekly}
              /week: ${phone.rates.Weekly * weeks}
            </div>
          )}
          {!!days && (
            <div>
              {days} {days > 1 ? "days" : "day"} @ ${phone.rates.Daily}
              /day: ${phone.rates.Daily * days}
            </div>
          )}
          <br />
          <div>Late Fees</div>
          <div>
            {lateWeeks} weeks @ $50/week: ${lateFees}
          </div>
          <div style={{ fontWeight: "bold", fontSize: "1.2em" }}>
            <span style={{ color: "red" }}>Total Late Charges: </span>$
            {latePrice + lateFees}
          </div>
          <br />
          <div style={{ border: "2px solid black", padding: "0.5em" }}>
            Per the{" "}
            <span
              style={{
                textDecoration: "underline",
                color: "blue",
                cursor: "pointer",
              }}
              onClick={() => setModalContent(lateReturnPolicy(phone))}
            >
              Late Return Policy
            </span>
            , Your original payment method will automatically be charged for any
            late fees.
          </div>
        </div>
      </div>
      <div
        style={{ marginTop: "2em" }}
        className="button-group button-group-horizontal"
      >
        <button onClick={() => navigate("return")}>Back</button>
        <button onClick={() => navigate("tutorial")}>How It Works</button>
        <button onClick={() => navigate("dropoff")}>Confirm Return</button>
      </div>
    </div>
  );
}

function Dropoff({ navigate }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("complete");
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);
  return (
    <div className="container flex-container">
      <h2 style={{ maxWidth: "75%" }}>
        Please Place Your Phone and Accessories Into The Drop Box
      </h2>
      <div className="flex-container">
        <div
          style={{ backgroundImage: "none" }}
          className="demo-video-container"
        >
          <div className="tutorial-video">
            Place phone and accessories in illuminated box.
          </div>
        </div>
        <div style={{ maxWidth: "70%", marginBottom: "0.5em" }}>
          <h3 style={{ color: "red" }}>
            Please try again. Ensure the drop box door fully closes.
          </h3>
        </div>
      </div>
      <button onClick={() => navigate("return-summary")}>Back</button>
    </div>
  );
}

function Complete({ navigate }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("welcome");
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className="container flex-container">
      <br />
      <h2>Return Complete!</h2>
      <br />
      <h2>Thank you for renting with us!</h2>
      <br />
      <h2>We hope you enjoyed your trip!</h2>
      <br />
      <br />
      <div className="airplane-image"></div>
      <br />
      <br />
      <button onClick={() => navigate("welcome")}>Exit</button>
    </div>
  );
}

function Modal({ setModalContent, navigate, modalContent, resetSettings }) {
  useEffect(() => {
    const button = document.querySelector("#return-code-button");
    if (button) {
      const listener = () => {
        setModalContent(null);
        navigate("return-summary");
      };
      button.addEventListener("click", listener);
      return () => button.removeEventListener("click", listener);
    }
    const confirmButton = document.querySelector("#confirm-exit-button");
    const cancelButton = document.querySelector("#cancel-exit-button");
    if (confirmButton && cancelButton) {
      const confirmListener = () => {
        resetSettings();
        navigate("welcome");
      };
      const cancelListener = () => {
        setModalContent(null);
      };
      confirmButton.addEventListener("click", confirmListener);
      cancelButton.addEventListener("click", cancelListener);
      return () => {
        confirmButton.removeEventListener("click", confirmListener);
        cancelButton.removeEventListener("click", cancelListener);
      };
    }
  });

  return (
    <div className="container modal-container">
      <div className="modal-body">
        <div
          className="close-button"
          onClick={() => setModalContent(null)}
        ></div>
        <h2 className="modal-title">{modalContent.title}</h2>
        <div
          className="modal-text"
          dangerouslySetInnerHTML={{ __html: modalContent.body }}
        ></div>
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState("welcome");
  const [phone, setPhone] = useState([...phones][0]);
  const [returnDate, setReturnDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0]
  );
  const [addOns, setAddons] = useState(mockAddons);
  const [modalContent, setModalContent] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  function navigate(newPage) {
    setPrevPage(page);
    setPage(newPage);
  }

  function handleExit() {
    setModalContent({
      title: "Exit Phone Rental",
      body: `<div style="width: fit-content">
        <div>Are you sure you want to exit?</div>
        <br />
        <div style="display: flex; gap: 1em">
        <button id="confirm-exit-button">Exit</button>
        <br />
        <button id="cancel-exit-button">Continue</button>
        </div>
        </div>`,
    });
  }

  function updateAddons(e, addOnName) {
    setAddons((current) => {
      return current.map((curr) => {
        if (addOnName !== curr.name) return curr;
        return { ...curr, selected: e.target.checked };
      });
    });
  }

  function clearAddons() {
    setAddons((current) => {
      return current.map((c) => {
        return { ...c, selected: false };
      });
    });
  }

  function resetSettings() {
    clearAddons();
    setPhone(phones[0]);
    setReturnDate(
      new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0]
    );
    setPrevPage(null);
    setModalContent(null);
  }

  return (
    <div className="container proto-container">
      {modalContent && (
        <Modal
          modalContent={modalContent}
          setModalContent={setModalContent}
          navigate={navigate}
          resetSettings={resetSettings}
        />
      )}
      {page === "welcome" && <Welcome navigate={navigate} />}
      {page === "demo" && <Demo phone={phone} navigate={navigate} />}
      {page === "rental-options" && (
        <RentalOptions
          clearAddons={clearAddons}
          phones={phones}
          phone={phone}
          returnDate={returnDate}
          setReturnDate={setReturnDate}
          setPhone={setPhone}
          navigate={navigate}
        />
      )}
      {page === "add-ons" && (
        <AddOns
          phone={phone}
          addOns={addOns}
          updateAddons={updateAddons}
          navigate={navigate}
        />
      )}
      {page === "checkout" && (
        <Checkout
          phone={phone}
          returnDate={returnDate}
          addOns={addOns}
          setReturnDate={setReturnDate}
          updateAddons={updateAddons}
          setModalContent={setModalContent}
          navigate={navigate}
          prevPage={prevPage}
        />
      )}
      {page === "tutorial" && (
        <Tutorial navigate={navigate} prevPage={prevPage} />
      )}
      {page === "success" && <Success navigate={navigate} />}
      {page === "return" && (
        <Return navigate={navigate} setModalContent={setModalContent} />
      )}
      {page === "return-summary" && (
        <ReturnSummary
          phone={phone}
          addOns={addOns}
          navigate={navigate}
          setModalContent={setModalContent}
        />
      )}
      {page === "dropoff" && <Dropoff navigate={navigate} />}
      {page === "complete" && <Complete navigate={navigate} />}

      {page !== "welcome" && !modalContent && (
        <div className="exit-button" onClick={handleExit}>
          {`EXIT`}
        </div>
      )}
      <HelpText page={page} />
    </div>
  );
}

export default App;
