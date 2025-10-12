import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { phones, addOns as mockAddons, lateReturnPolicy, insertPaymentMethod } from './mockData';
import './App.css'

function App() {
  const [page, setPage] = useState('welcome');
  const [phone, setPhone] = useState(phones[0]);
  const [duration, setDuration] = useState(null);
  const [numPeriods, setNumPeriods] = useState(1);
  const [addOns, setAddons] = useState(mockAddons);
  const [modalContent, setModalContent] = useState(null);

  function HelpText() {
    return <div className='help-text'>{"Need help? Call 1-800-123-4567 (24/7 Support)"}</div>
  }

  function Welcome() {
    return(<div className='container welcome-container'>
      <div>
        <h1>Welcome!</h1>
        <h2>Phones for Every Destination!</h2>
      </div>
      <div className='button-group'>
        <button onClick={() => setPage('demo')}>Start Rental!</button>
        <button onClick={() => setPage('return')}>Rental Return</button>
        <button onClick={() => setPage('tutorial')}>Watch How it Works</button>
      </div>
    </div>)
  }

  function Demo() {
    return (<div className='container demo-container'>
      <h2>{`Rent the ${phone.name} for your trip!`}</h2>
      <div className="demo-video-container"></div>
      <div className="button-group button-group-horizontal">
        <button onClick={() => setPage('rental-options')}>See Other Options</button>
        <button onClick={() => setPage('add-ons')}>Rent This Phone</button>
      </div>
      <HelpText />
    </div>)
  }

  function RentalOptions() {
    const containerRef = useRef();

    useEffect(() => {
      const scrollContainer = containerRef.current;
      if (scrollContainer) {
        const handleScroll = () => {
          localStorage.setItem('prototype-scroll-position', scrollContainer.scrollLeft)
        };
        scrollContainer.addEventListener('scroll', handleScroll);
        return () => {
          localStorage.clear()
          scrollContainer.removeEventListener('scroll', handleScroll);
        };
      }
    }, []);

    useLayoutEffect(() => {
      const scrollContainer = containerRef.current;
      if (scrollContainer) {
        const scrollPos = localStorage.getItem('prototype-scroll-position')
        scrollContainer.scrollLeft = scrollPos ?? 0; 
      }
    });
    return (
      <div className="container rental-options-container">
        <h2>Choose A Phone</h2>
        <div ref={containerRef} className="phone-list-container">
          {/* Add the key prop here */}
          {phones.map((p) => (
            <div key={p.name} className="phone-container">
              <h3>{p.name}</h3>

              {/* And also add the key prop here */}
              {Object.keys(p.rates).map((rateName) => {
                return (
                  <div key={rateName} className="phone-rate-row">
                    <label>
                      <input
                        type="radio"
                        name="rental-duration"
                        value={`${p.name}-${rateName}`} // Also fixed a bug here!
                        checked={phone.name === p.name && duration === rateName}
                        onChange={() => {
                          setDuration(rateName);
                          setPhone(p);
                        }}
                      />
                      {rateName.charAt(0).toUpperCase() + rateName.slice(1)}
                    </label>
                    ${p["rates"][rateName]}
                  </div>
                );
              })}
              <div className="phone-button-group button-group button-group-horizontal">
                <button
                  className="btn-small"
                  onClick={() => {
                    setPhone(p);
                    setPage("demo");
                  }}
                >
                  Demo
                </button>
                <button
                  disabled={duration == null || phone.name !== p.name}
                  className="btn-small"
                  onClick={() => {
                    setPhone(p);
                    setPage("add-ons");
                  }}
                >
                  Add-Ons
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="button-group button-group-horizontal">
          <button onClick={() => setPage("demo")}>Back</button>
          <button disabled={duration == null} onClick={() => setPage("checkout")}>
            Checkout
          </button>
        </div>
        <HelpText />
      </div>
    );
  }

  function updateAddons(e, addOnName) {
      setAddons(current => {
        return current.map(curr => {
          if (addOnName !== curr.name) return curr;
          return {...curr, selected: e.target.checked}
        })
      })
    }

  function AddOns() {

    return <div className='container add-ons-container'>
      <h2>Choose Accessories and Service for Your Trip</h2>
      {addOns.map(addOn => <div className='add-on-container' key={addOn.name}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div className='add-on-icon' style={{backgroundImage: `url(${addOn.img})`}}></div>
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
              onChange={e => updateAddons(e, addOn.name)} 
              checked={addOn.selected}
            />
          </label>
        </div>
      </div>)}
      <div className="button-group button-group-horizontal">
          <button onClick={() => setPage("rental-options")}>Back</button>
          <button disabled={duration == null} onClick={() => setPage("checkout")}>
            Checkout
          </button>
        </div>
        <HelpText />
    </div>
  }

  function Checkout() {
    const rentalPrice = phone['rates'][duration] * numPeriods;
    const addOnsPrice = addOns.reduce((acc, curr) => {return acc + (curr.selected ? curr.price : 0)}, 0);
    const totalPrice = rentalPrice + addOnsPrice;

    function addDays(date, numDays) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + numDays);
      return newDate;
    }

    const today = new Date();
    const dueDate = 
      duration === 'daily' 
        ? addDays(today, numPeriods) 
      : duration === 'weekly' 
        ? addDays(today, numPeriods * 7) 
        : new Date(new Date(today).setMonth(today.getMonth() + numPeriods));

    return <div className="container checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-layout">
        <div className="checkout-summary">
          <div>Model: {phone.name}</div>
          <div>Rental Period: {duration}</div>
          <div>Rate: ${phone['rates'][duration]} / Period</div>
          <div style={{display: 'flex'}}>Periods:&nbsp;&nbsp;
            <div className="periods change-periods" onClick={() => setNumPeriods(n => Math.max(n-1, 1))}>-</div>
            <div className="periods number-periods">{numPeriods}</div>
            <div className="periods change-periods" onClick={() => setNumPeriods(n => n+1)}>+</div>
          </div>
          <div>Return Date: {dueDate.toLocaleDateString()}</div>
          <div style={{fontWeight: 'bold'}}>Phone Subtotal: ${rentalPrice}</div>
          <br />
          <div>Add-Ons:</div>
          {addOns.map(a => <div key={a.name}>
            <input 
              style={{ width: 'unset', height: 'unset'}} 
              type="checkbox" 
              name={a.name} 
              id={a.name}
              checked={a.selected}
              onChange={e => updateAddons(e, a.name)}
            />
            {a.name} ${a.price}
            </div>
          )}
          <div style={{fontWeight: 'bold'}}>Add-Ons Subtotal: ${addOnsPrice}</div>
          <br />
          <div style={{fontWeight: 'bold', fontSize: '1.2em'}}><span style={{color: 'green'}}>Grand Total: </span>${totalPrice}</div>
        </div>
        <div className="checkout-payment">
          <h4>Select Payment Method</h4>
          <div className='payment-method-grid'>
            <div onClick={() => setModalContent(insertPaymentMethod)} className="payment-button">Debit</div>
            <div onClick={() => setModalContent(insertPaymentMethod)} className="payment-button">Credit</div>
            <div onClick={() => setModalContent(insertPaymentMethod)} className="payment-button">GPay</div>
            <div onClick={() => setModalContent(insertPaymentMethod)} className="payment-button"><img src="./apple.png" alt="" />Pay</div>
          </div>
          <label>
            Email
            <br />
            <input type="text" />
          </label>
          <div className="tos-container">
              <input type="checkbox" name="tos" id="tos" />
              <span className="tos-text">
                I agree to the terms of the <span className="tos-link" onClick={() => setModalContent(lateReturnPolicy)}>Late Return Policy</span>
              </span>
          </div>
        </div>
      </div>
    </div>
  }

  function Modal() {
    return <div className="container modal-container">
      <div className="modal-body">
        <div className="close-button" onClick={() => setModalContent(null)}></div>
        <h2 className="modal-title">{modalContent.title}</h2>
        <div className="modal-text">{modalContent.body}</div>
      </div>
    </div>
  }

  return (
    <div className="container proto-container">
      {modalContent && <Modal />}
      {page === 'welcome' && <Welcome />}
      {page === 'demo' && <Demo />}
      {page === 'rental-options' && <RentalOptions />}
      {page === 'add-ons' && <AddOns />}
      {page === 'checkout' && <Checkout />}
    </div>
  )
}

export default App
