export const rentalPeriods = [
  "Daily",
  "Weekly",
  "Monthly"
]

export const phones = [
    {
      name: "iPhone 17",
      rates: {
        Daily: 35,
        Weekly: 169,
        Monthly: 449
      }
    },
    {
      name: "Galaxy S25",
      rates: {
        Daily: 34,
        Weekly: 160,
        Monthly: 410
      }
    },
    {
      name: "Google Pixel 10",
      rates: {
        Daily: 32,
        Weekly: 155,
        Monthly: 390
      }
    },
    {
      name: "OnePlus 15",
      rates: {
        Daily: 29,
        Weekly: 140,
        Monthly: 350
      }
    },
    {
      name: "Xiaomi 15 Ultra",
      rates: {
        Daily: 28,
        Weekly: 135,
        Monthly: 340
      }
    }
  ]

export const addOns = [
  {
    name: "Phone Case",
    img: "./case-icon.png",
    desc: "Protect Your Phone While You Travel",
    price: 12,
    selected: false
  },
  {
    name: "SIM Card",
    img: "./sim-icon.png",
    desc: "Stay Connected Abroad",
    price: 8,
    selected: false
  },
  {
    name: "Charger & Power Bank",
    img: "./charger-icon.png",
    desc: "Keep Powered On The Go",
    price: 30,
    selected: false
  },
  {
    name: "Insurance",
    img: "./insurance-icon.png",
    desc: "Peace Of Mind For Your Rental",
    price: 60,
    selected: false
  },
]

export const lateReturnPolicy = {
  title: "Late Return Policy",
  body: "Your original payment method will automatically be charged your selected rate plus a $50 late fee for each week the phone is not returned past the return date. Additional charges will be posted to your original payment method on the 1st of each month until the phone is returned."
}

export const insertPaymentMethod = {
  title: "Payment",
  body: "Insert payment card or place phone over contactless payment terminal."
}