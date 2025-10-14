import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { phones, addOns as mockAddons, lateReturnPolicy, insertPaymentMethod, rentalPeriods } from './mockData';
import './App.css'

function App() {
  const [page, setPage] = useState('welcome');
  const [phone, setPhone] = useState(phones[0]);
  const [duration, setDuration] = useState('Daily');
  const [numPeriods, setNumPeriods] = useState(1);
  const [addOns, setAddons] = useState(mockAddons);
  const [modalContent, setModalContent] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  function navigate(newPage) {
    localStorage.clear();
    setPrevPage(page);
    setPage(newPage);
  }

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
        <button onClick={() => navigate('demo')}>Start Rental!</button>
        <button onClick={() => navigate('return')}>Rental Return</button>
        <button onClick={() => navigate('tutorial')}>Watch How it Works</button>
      </div>
    </div>)
  }

  function Demo() {
    return (<div className='container demo-container'>
      <h2>{`Rent the ${phone.name} for your trip!`}</h2>
      <div className="demo-video-container"></div>
      <div className="button-group button-group-horizontal">
        <button onClick={() => navigate('rental-options')}>See Other Options</button>
        <button onClick={() => navigate('checkout')}>Rent This Phone</button>
      </div>
      <HelpText />
    </div>)
  }

  function RentalOptions() {
    const containerRef = useRef();

    function clearAddons() {
      setAddons(current => {
        return current.map(c => {
          return {...c, selected: false}
        })
      })
    }

    useEffect(() => {
      const scrollContainer = containerRef.current;
      if (scrollContainer) {
        const handleScroll = () => {
          localStorage.setItem('prototype-scroll-position', scrollContainer.scrollLeft)
        };
        scrollContainer.addEventListener('scroll', handleScroll);
        return () => {
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
          {phones.map((p) => (
            <div key={p.name} className="phone-container">
              <h3>{p.name}</h3>

              {Object.keys(p.rates).map((rateName) => {
                return (
                  <div key={rateName} className="phone-rate-row">
                    <label>
                      <input
                        type="radio"
                        name="rental-duration"
                        value={`${p.name}-${rateName}`}
                        checked={phone.name === p.name && duration === rateName}
                        onChange={() => {
                          clearAddons();
                          setDuration(rateName);
                          setPhone(p);
                        }}
                      />
                      {rateName}
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
                    navigate("demo");
                  }}
                >
                  Demo
                </button>
                <button
                  disabled={phone.name !== p.name}
                  className="btn-small"
                  onClick={() => {
                    setPhone(p);
                    navigate("add-ons");
                  }}
                >
                  Add-Ons
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="button-group button-group-horizontal">
          <button onClick={() => navigate('demo')}>Back</button>
          <button onClick={() => navigate("checkout")}>
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
      <h2>Choose Accessories and Service for Your {phone.name}</h2>
      {addOns.map(addOn => <div className='add-on-container' key={addOn.name}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div className='add-on-icon' style={{backgroundImage: `url(./img/${addOn.img})`}}></div>
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
        <button onClick={() => navigate('rental-options')}>Pick Another Phone</button>
        <button onClick={() => navigate("checkout")}>
          Checkout
        </button>
      </div>
      <HelpText />
    </div>
  }

  function Tutorial() {
    const [currentSegment, setCurrentSegment] = useState(0);
    const segmentText = [
      "Choosing a Phone",
      "Payment Methods",
      "Collecting Items",
      "Returning Items"
    ]
    return <div className='container flex-container tutorial-container'>
      <h2>How It Works!</h2>
        <div onClick={() => setCurrentSegment(s => s-1)} className={`left-arrow ${currentSegment === 0 ? 'hidden' : ''}`} ></div>

      <div className="progress-bar">
        <div>
          Choose Phone
          <div onClick={() => setCurrentSegment(0)} className={`progress-segment ${currentSegment === 0 ? 'current-segment' : ''}`}></div>
        </div>
        <div>
          Pay
          <div onClick={() => setCurrentSegment(1)} className={`progress-segment ${currentSegment === 1 ? 'current-segment' : ''}`}></div>
        </div>
        <div>
          Pick Up
          <div onClick={() => setCurrentSegment(2)} className={`progress-segment ${currentSegment === 2 ? 'current-segment' : ''}`}></div>
        </div>
        <div>
          Return
          <div onClick={() => setCurrentSegment(3)} className={`progress-segment ${currentSegment === 3 ? 'current-segment' : ''}`}></div>
        </div>
      </div>
        <div onClick={() => setCurrentSegment(s => s+1)} className={`right-arrow ${currentSegment === 3 ? 'hidden' : ''}`} ></div>

      <div className="tutorial-video-container">
        <div className="tutorial-video">
          {segmentText[currentSegment]}
        </div>
      </div>
      <div className="button-group button-group-horizontal">
        <button onClick={() => navigate(prevPage)}>Back</button>
        <button onClick={() => navigate("checkout")}>
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
    const [agreedTos, setAgreedTos] = useState(false);

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
          <div>Rental Period:&nbsp;
            <select value={duration} onChange={e => setDuration(e.target.value)}>
              {rentalPeriods.map(per => {
                const price = phone['rates'][per];
                return <option key={`${phone.name}-${per}`} value={per}>{per}: ${price}</option>
              })}
            </select>
          </div>
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
            <label>
              <input 
                style={{ width: 'unset', height: 'unset'}} 
                type="checkbox" 
                name={a.name} 
                id={a.name}
                checked={a.selected}
                onChange={e => updateAddons(e, a.name)}
              />
              {a.name} ${a.price}
            </label>
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
            <div onClick={() => setModalContent(insertPaymentMethod)} className="payment-button"><img src="./img/apple.png" alt="" />Pay</div>
          </div>
          <label>
            Email
            <br />
            <input type="text" />
          </label>
          <div className="tos-container">
              <input type="checkbox" name="tos" id="tos" checked={agreedTos} onChange={e => setAgreedTos(e.target.checked)}/>
              <span className="tos-text">
                I agree to the terms of the <span className="tos-link" onClick={() => setModalContent(lateReturnPolicy)}>Late Return Policy</span>
              </span>
          </div>
        </div>
      </div>
      <div className='button-group button-group-horizontal'>
        <button onClick={() => navigate(prevPage)}>Back</button>
        <button onClick={() => navigate('tutorial')}>How It Works</button>
        <button disabled={!agreedTos} onClick={() => navigate('success')}>Continue</button>
      </div>
      <HelpText />
    </div>
  }

  function Success() {
    useEffect(() => {
      const timer = setTimeout(() => {
        navigate('welcome');
      }, 10000);

      return (() => {
        clearTimeout(timer);
      })
    }, [])
    return <div className='container flex-container'>
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
      <button onClick={() => navigate('welcome')}>Exit</button>
    </div>
  }

  function Return() {
    const returnCodeInput = {
      title: "Input Return Code",
      body: `<div>
        <div>Please enter the return code on your rental phone.</div>
        <br />
        <div><label>Return Code: <input></input></label></div>
        <br />
        <button id="return-code-button">Submit</button>
        </div>`
    }

    return (<div className='container flex-container'>
      <h2>Scan Your QR Code to Begin</h2>
      <br />
      <div className='flex-container'>
        <div style={{backgroundImage: 'none'}} className="demo-video-container">
          <div className="tutorial-video">
            Place phone under scanner
          </div>
        </div>
        <div style={{maxWidth: '70%', marginBottom: '0.5em'}} >
          <h3 style={{color: 'red'}}>Error reading QR code. Hold the phone steady and closer to the scanner, or input return code manually.</h3>
        </div>
      </div>
      <div className="button-group button-group-horizontal">
        <button onClick={() => navigate('welcome')}>Back</button>
        <button onClick={() => setModalContent(returnCodeInput)}>Enter Code</button>
      </div>
      <HelpText />
    </div>)
  }

  function ReturnSummary() {
    const rentalPrice = phone['rates']['Weekly'] * 3;
    const addOnsPrice = addOns.slice(0,2).reduce((acc, curr) => {return acc + curr.price}, 0);
    const totalPrice = rentalPrice + addOnsPrice;

    function addDays(date, numDays) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + numDays);
      return newDate;
    }

    const today = new Date();
    const dueDate = addDays(today, -3) 
    const rentalDate = addDays(dueDate, -21);
    const diffInMilliseconds = today.getTime() - dueDate.getTime();
    const daysLate = Math.max(0, Math.round(diffInMilliseconds / 1000 * 60 * 60 * 24));
    return <div style={{position: 'relative'}} className="container checkout-container">
      <h2>Checkout</h2>
      <br />
      <div className="checkout-layout">
        <div className="checkout-summary">
          <div>Model: {phone.name}</div>
          <div>Rental Period: Weekly
          </div>
          <div>Rate: ${phone['rates']['Weekly']} / Period</div>
          <div style={{display: 'flex'}}>Periods: 3</div>
          <div>Due Date: {dueDate.toLocaleDateString()}</div>
          <div style={{fontWeight: 'bold'}}>Phone Subtotal: ${rentalPrice}</div>
          <br />
          <div>Add-Ons:</div>
          {addOns.slice(0,2)
            .map(a => <div key={a.name}>{a.name} ${a.price}</div>)
          }
          <div style={{fontWeight: 'bold'}}>Add-Ons Subtotal: ${addOnsPrice}</div>
          <br />
          <div style={{fontWeight: 'bold', fontSize: '1.2em'}}><span style={{color: 'green'}}>Amount Paid: </span>${totalPrice}</div>
        </div>
        <div className="checkout-summary">
          <div>Late Fees</div>
          <div>Current Date: {today.toLocaleDateString()}</div>
          <div>Overdue Rate: ${phone['rates']['Weekly']} Weekly</div>
          <div>Late Fee: $50 Weekly</div>
          <div>Late Charges: 1 Week</div>
          <br />
          <div style={{fontWeight: 'bold', fontSize: '1.2em'}}><span style={{color: 'red'}}>Total Late Charges: </span>$75</div>
          <br />
          <br />
          <div style={{border: '2px solid black', padding: '0.5em'}}>
            Per the <span style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}} onClick={() => setModalContent(lateReturnPolicy)}>Late Return Policy</span>, Your original payment method will automatically be charged for any late fees.
          </div>
        </div>
        <HelpText />
      </div>
      <div style={{marginTop: '2em'}} className='button-group button-group-horizontal'>
        <button onClick={() => navigate('return')}>Back</button>
        <button onClick={() => navigate('tutorial')}>How It Works</button>
        <button onClick={() => navigate('dropoff')}>Confirm Return</button>
      </div>
    </div>
  }

  function Dropoff() {
    useEffect(() => {
    const timer = setTimeout(() => {
      navigate('complete');
    }, 10000);

    return (() => {
      clearTimeout(timer);
    })
  }, [])
    return (<div className='container flex-container'>
      <h2 style={{maxWidth: '75%'}}>Please Place Your Phone and Accessories Into The Drop Box</h2>
      <div className='flex-container'>
        <div style={{backgroundImage: 'none'}} className="demo-video-container">
          <div className="tutorial-video">
            Place phone and accessories in illuminated box.
          </div>
        </div>
        <div style={{maxWidth: '70%', marginBottom: '0.5em'}} >
          <h3 style={{color: 'red'}}>Please try again. Ensure the drop box door fully closes.</h3>
        </div>
      </div>
      <button onClick={() => navigate('return-summary')}>Back</button>
      <HelpText />
    </div>)
  }

  function Complete() {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('welcome');
    }, 10000);

    return (() => {
      clearTimeout(timer);
    })
  }, [])
  return <div className='container flex-container'>
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
      <button onClick={() => navigate('welcome')}>Exit</button>
    </div>
  }

  function Modal() {
    useEffect(() => {
      const button = document.querySelector('#return-code-button');
      if (button) {
        const listener = () => {setModalContent(null); navigate('return-summary')}
        button.addEventListener('click', listener);
        return () => button.removeEventListener('click', listener);
      }
    })

    return <div className="container modal-container">
      <div className="modal-body">
        <div className="close-button" onClick={() => setModalContent(null)}></div>
        <h2 className="modal-title">{modalContent.title}</h2>
        <div className="modal-text" dangerouslySetInnerHTML={{__html: modalContent.body}}></div>
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
      {page === 'tutorial' && <Tutorial />}
      {page === 'success' && <Success />}
      {page === 'return' && <Return />}
      {page === 'return-summary' && <ReturnSummary />}
      {page === 'dropoff' && <Dropoff />}
      {page === 'complete' && <Complete />}
    </div>
  )
}

export default App
