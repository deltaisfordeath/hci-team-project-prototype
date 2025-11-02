export const phones = [
    {
      name: "iPhone 17",
      description: "Apple's latest flagship, featuring the A20 Pro chip and a dynamic Pro-Motion XDR display.",
      rates: {
        Daily: 35,
        Weekly: 169,
        Monthly: 449
      }
    },
    {
      name: "Galaxy S25",
      description: "Samsung's premier device with an integrated S-Pen Pro and a stunning 200MP adaptive sensor.",
      rates: {
        Daily: 34,
        Weekly: 160,
        Monthly: 410
      }
    },
    {
      name: "Google Pixel 10",
      description: "Experience unparalleled AI-powered photography and the new Google Tensor G6 chip.",
      rates: {
        Daily: 32,
        Weekly: 155,
        Monthly: 390
      }
    },
    {
      name: "OnePlus 15",
      description: "The 'Flagship Killer' offers ultra-fast 200W charging and a silky-smooth 144Hz fluid display.",
      rates: {
        Daily: 29,
        Weekly: 140,
        Monthly: 350
      }
    },
    {
      name: "Xiaomi 15 Ultra",
      description: "A powerhouse of innovation, co-engineered with Leica for professional-grade imaging.",
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
    img: "case-icon.png",
    desc: "Protect Your Phone While You Travel",
    price: 12,
    selected: false
  },
  {
    name: "SIM Card",
    img: "sim-icon.png",
    desc: "Stay Connected Abroad",
    price: 8,
    selected: false
  },
  {
    name: "Charger & Power Bank",
    img: "charger-icon.png",
    desc: "Keep Powered On The Go",
    price: 30,
    selected: false
  },
  {
    name: "Insurance",
    img: "insurance-icon.png",
    desc: "Peace Of Mind For Your Rental",
    price: 60,
    selected: false
  },
]

export const insertPaymentMethod = {
  title: "Payment",
  body: "Insert payment card or place phone over contactless payment terminal."
}