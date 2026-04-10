// BACKEND INTEGRATION: This entire file is replaced by actual scraping API responses
// and LLM API output. Swap in real data by matching this shape.

export const MOCK_PRODUCT_DATA = {
  id: 'prod-sony-wh1000xm5',
  name: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
  category: 'Audio / Headphones',

  siteA: {
    name: 'ShopNow',
    url: 'https://shopnow.example.com/sony-wh1000xm5',
    price: 27990,
    originalPrice: 33990,
    discount: '-18%',
    currency: 'INR',
    inStock: true,
    stockLevel: 'Low stock — 4 left',
    rating: 4.6,
    reviewCount: 3842,
    deliveryEstimate: '2–4 business days',
    seller: 'ShopNow Official',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c4b2e322-1768327279480.png",
    imageAlt: 'Sony WH-1000XM5 black over-ear wireless headphones on white background',
    badges: ['Free Returns', '2-Year Warranty']
  },

  siteB: {
    name: 'MegaMart',
    url: 'https://megamart.example.com/sony-wh1000xm5',
    price: 24990,
    originalPrice: 33990,
    discount: '-26%',
    currency: 'INR',
    inStock: true,
    stockLevel: 'In stock',
    rating: 4.4,
    reviewCount: 2107,
    deliveryEstimate: '1–2 business days',
    seller: 'MegaMart Electronics',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_11fab56ae-1768327278590.png",
    imageAlt: 'Sony WH-1000XM5 headphones in silver colorway displayed on wooden surface',
    badges: ['Price Match Guarantee', 'Free Shipping']
  },

  verdict: {
    recommendation: 'Buy from MegaMart',
    site: 'MegaMart',
    confidence: 'High',
    savingsAmount: 3000,
    savingsPct: 10.7,
    summary:
    'Although MegaMart has a slightly lower reviewer rating (4.4 vs 4.6), the ₹3,000 price difference is significant and both stores carry genuine Sony products with full warranty. MegaMart\'s faster shipping (1–2 days vs 2–4) and active Price Match Guarantee make it the clear choice. ShopNow\'s "Low stock" warning adds urgency to buy now rather than wait.',
    pros: [
    'Saves ₹3,000 (10.7%) over ShopNow',
    'Faster delivery: 1–2 days vs 2–4 days',
    'Price Match Guarantee protects your purchase',
    'Healthy stock levels — no artificial scarcity'],

    cons: [
    'Slightly lower reviewer rating (4.4 vs 4.6)',
    '1,735 fewer reviews — smaller sample size']

  },

  reviewAnalysis: {
    siteA: {
      name: 'ShopNow',
      overallSentiment: 'Strongly Positive',
      sentimentScore: 88,
      pros: [
      'Industry-leading noise cancellation consistently praised',
      'Battery life exceeds the advertised 30 hours in user testing',
      'Premium build quality — feels significantly better than previous models',
      'Multipoint Bluetooth works flawlessly with phone + laptop simultaneously'],

      cons: [
      'Carrying case feels cheap relative to the headphone quality',
      'Touch controls have a learning curve — accidental skips reported',
      'Some users report call microphone picks up background noise'],

      topReview: {
        author: 'Marcus T.',
        rating: 5,
        text: 'Bought these for a 14-hour flight. Didn\'t hear a single engine drone the entire time. Best purchase I\'ve made this year.',
        date: '2026-03-28'
      }
    },
    siteB: {
      name: 'MegaMart',
      overallSentiment: 'Positive',
      sentimentScore: 81,
      pros: [
      'Excellent value at the discounted price point',
      'Noise cancellation on par with what competitors charge ₹45,000+ for',
      'Comfortable for extended sessions — no ear fatigue after 4+ hours',
      'App customization (EQ, ANC levels) adds significant value'],

      cons: [
      'A handful of reviews mention units arriving without full charge',
      'Headband can feel tight initially — takes 2–3 weeks to break in',
      'Some variance in packaging quality reported in recent orders'],

      topReview: {
        author: 'Priya N.',
        rating: 4,
        text: 'Great headphones for the price. I\'ve had them 3 months and the ANC still works perfectly. Docking one star only because the case is disappointing.',
        date: '2026-04-01'
      }
    }
  },

  priceHistory: [
  { date: '03/18', shopNow: 33990, megaMart: 33990 },
  { date: '03/22', shopNow: 31990, megaMart: 30990 },
  { date: '03/25', shopNow: 30990, megaMart: 29490 },
  { date: '03/28', shopNow: 29490, megaMart: 27990 },
  { date: '04/01', shopNow: 28990, megaMart: 26490 },
  { date: '04/04', shopNow: 27990, megaMart: 25490 },
  { date: '04/07', shopNow: 27990, megaMart: 24990 }],


  specs: [
  { label: 'Driver Size', value: '30mm' },
  { label: 'Frequency Response', value: '4 Hz – 40,000 Hz' },
  { label: 'Battery Life', value: '30 hours (ANC on)' },
  { label: 'Charging Time', value: '3.5 hours (USB-C)' },
  { label: 'Quick Charge', value: '3 min → 3 hours playback' },
  { label: 'Weight', value: '250g' },
  { label: 'Bluetooth', value: '5.2, multipoint' },
  { label: 'Codecs', value: 'SBC, AAC, LDAC' }]

};

export type ProductData = typeof MOCK_PRODUCT_DATA;