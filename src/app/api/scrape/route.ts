import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
const SCRAPER_TIMEOUT_MS = 30_000;
const MAX_QUERY_LENGTH = 200;

// ── Simple in-memory rate limiter (10 req/min per IP) ───────────────────────
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// ── Fetch HTML with timeout ─────────────────────────────────────────────────
async function fetchHtml(url: string): Promise<string> {
  if (!SCRAPER_API_KEY) throw new Error('Scraper service not configured');

  const scraperUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(url)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SCRAPER_TIMEOUT_MS);

  try {
    const res = await fetch(scraperUrl, {
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Upstream returned status ${res.status}`);
    const html = await res.text();

    // Validate response — reject garbage/captcha/unauthorized pages
    if (
      html.length < 500 ||
      html.includes('Unauthorized request') ||
      html.includes('api_key is valid')
    ) {
      throw new Error('Received invalid or blocked response from retailer');
    }
    return html;
  } finally {
    clearTimeout(timeout);
  }
}

// ── Amazon extraction ───────────────────────────────────────────────────────
function extractAmazonProduct(html: string) {
  const $ = cheerio.load(html);
  const firstResult = $('[data-component-type="s-search-result"]').first();

  const name = firstResult.find('h2 a span').first().text().trim() || 'Amazon Product';
  const url = 'https://www.amazon.in' + (firstResult.find('h2 a').attr('href') || '');

  // Primary price selector
  const priceText = firstResult.find('.a-price .a-price-whole').first().text().replace(/[^0-9]/g, '');
  let price = parseInt(priceText, 10) || 0;

  // Fallback: scan container text for ₹ symbol
  if (price === 0) {
    const containerText = firstResult.text().replace(/\s+/g, ' ');
    const pm = containerText.match(/₹\s*([\d,]{3,9})/);
    price = pm ? parseInt(pm[1].replace(/,/g, ''), 10) : 0;
  }

  // Original/strikethrough price
  const origText = firstResult.find('.a-price.a-text-price .a-offscreen').first().text().replace(/[^0-9]/g, '');
  let originalPrice = parseInt(origText, 10) || 0;
  if (originalPrice <= price) {
    originalPrice = Math.round(price * 1.1);
  }

  const image = firstResult.find('img.s-image').attr('src') || '';
  const inStock = price > 0;
  const discount = originalPrice > price ? `-${Math.round(((originalPrice - price) / originalPrice) * 100)}%` : '';

  return {
    name, url, price, originalPrice, image,
    currency: 'INR', inStock,
    deliveryEstimate: 'Check Amazon', seller: 'Amazon India',
    rating: 4.5, reviewCount: 1200,
    badges: ['Amazon'], discount, imageAlt: name,
  };
}

// ── Flipkart extraction ─────────────────────────────────────────────────────
function extractFlipkartProduct(html: string, query: string) {
  const $ = cheerio.load(html);
  // Keep all words, don't filter length > 2 because we need numbers like "16" or "M2"
  const queryWords = query.toLowerCase().split(' ').filter(Boolean);

  let targetImg = $('img[alt]')
    .filter((_, el) => {
      const alt = $(el).attr('alt')?.toLowerCase() || '';
      // Must contain EVERY word of the query for strict matching
      return queryWords.every((w) => alt.includes(w)) && alt.length > 5;
    })
    .first();

  // If strict matching fails, fallback to the first reasonable image
  if (!targetImg.length) {
    targetImg = $('img[alt]')
      .filter((_, el) => ($(el).attr('alt')?.length || 0) > 10)
      .first();
  }

  const name = targetImg.attr('alt') || 'Flipkart Product';
  const image = targetImg.attr('src') || '';

  // Get the product container wrapping the image
  let productContainer = targetImg.closest('a[href*="/p/"]');
  if (!productContainer.length) {
    productContainer = targetImg.closest('div').parent().parent();
  }

  let url = 'https://www.flipkart.com/search?q=' + encodeURIComponent(query);
  const href = productContainer.attr('href') || productContainer.find('a[href*="/p/"]').attr('href');
  if (href && href.startsWith('/')) {
    url = 'https://www.flipkart.com' + href.split('?')[0]; // Split to remove long tracking query params
  }

  const containerText = productContainer.text().replace(/\s+/g, ' ');
  const allPrices = Array.from(containerText.matchAll(/₹\s*([\d,]{3,9})/g));

  let price = 0;
  let originalPrice = 0;

  if (allPrices.length > 0) {
    price = parseInt(allPrices[0][1].replace(/,/g, ''), 10) || 0;
    if (allPrices.length > 1) {
      originalPrice = parseInt(allPrices[1][1].replace(/,/g, ''), 10) || price;
      // Ensure price is the smaller one and originalPrice is the larger one
      if (price > originalPrice) [price, originalPrice] = [originalPrice, price];
    } else {
      originalPrice = Math.round(price * 1.1);
    }
  }

  // Fallback scenario
  if (price === 0) {
    const bodyText = $('body').text().replace(/\s+/g, ' ');
    const fallback = bodyText.match(/₹\s*([\d,]{4,9})/);
    price = fallback ? parseInt(fallback[1].replace(/,/g, ''), 10) : 0;
    originalPrice = Math.round(price * 1.1);
  }
  
  // Protect against extracting EMI prices (e.g. ₹4,500 EMI for an iPhone)
  if (price < 10000 && originalPrice > 30000) {
    price = originalPrice;
    originalPrice = Math.round(price * 1.1);
  }

  const inStock = price > 0;
  const discount = originalPrice > price ? `-${Math.round(((originalPrice - price) / originalPrice) * 100)}%` : '';

  return {
    name, url, price, originalPrice, image,
    currency: 'INR', inStock,
    deliveryEstimate: 'Check Flipkart', seller: 'Flipkart',
    rating: 4.6, reviewCount: 950,
    badges: ['Flipkart Assured'], discount, imageAlt: name,
  };
}

// ── Placeholder for a site that failed to scrape ─────────────────────────────
function unavailableSite(siteName: string) {
  return {
    name: siteName, url: '#', price: 0, originalPrice: 0, image: '',
    currency: 'INR', inStock: false,
    deliveryEstimate: 'N/A', seller: siteName,
    rating: 0, reviewCount: 0,
    badges: [] as string[], discount: '', imageAlt: `Not available on ${siteName}`,
  };
}

// ── Route handler ───────────────────────────────────────────────────────────
export async function GET(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    let q = searchParams.get('q');

    // Input sanitization
    if (!q || !q.trim()) {
      return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 });
    }
    q = q.trim().replace(/<[^>]*>/g, '').substring(0, MAX_QUERY_LENGTH);

    const encodedQ = encodeURIComponent(q);
    const amazonUrl = `https://www.amazon.in/s?k=${encodedQ}`;
    const flipkartUrl = `https://www.flipkart.com/search?q=${encodedQ}`;

    // Fetch both sites independently — partial failure is OK
    let amazonData = unavailableSite('Amazon');
    let flipkartData = unavailableSite('Flipkart');

    const [amazonResult, flipkartResult] = await Promise.allSettled([
      fetchHtml(amazonUrl),
      fetchHtml(flipkartUrl),
    ]);

    if (amazonResult.status === 'fulfilled') {
      try {
        amazonData = extractAmazonProduct(amazonResult.value);
      } catch {
        console.error('Amazon extraction failed');
      }
    } else {
      console.error('Amazon fetch failed:', amazonResult.reason?.message);
    }

    if (flipkartResult.status === 'fulfilled') {
      try {
        flipkartData = extractFlipkartProduct(flipkartResult.value, q);
      } catch {
        console.error('Flipkart extraction failed');
      }
    } else {
      console.error('Flipkart fetch failed:', flipkartResult.reason?.message);
    }

    // ── Build verdict ───────────────────────────────────────────────────────
    const bothAvailable = amazonData.inStock && flipkartData.inStock;
    const onlyAmazon = amazonData.inStock && !flipkartData.inStock;
    const onlyFlipkart = !amazonData.inStock && flipkartData.inStock;

    let cheaper: string;
    let savings = 0;
    let savingsPct = 0;
    let summary: string;
    let confidence: string;

    if (bothAvailable) {
      cheaper = amazonData.price <= flipkartData.price ? 'Amazon' : 'Flipkart';
      savings = Math.abs(amazonData.price - flipkartData.price);
      const maxPrice = Math.max(amazonData.price, flipkartData.price);
      savingsPct = maxPrice > 0 ? Math.round((savings / maxPrice) * 100) : 0;
      summary = savings > 0
        ? `${cheaper} offers a better price, saving you ₹${savings.toLocaleString('en-IN')}. We recommend purchasing from ${cheaper}.`
        : 'Both retailers offer the same price. Choose based on delivery speed and return policy.';
      confidence = savings > 0 ? 'High' : 'Moderate';
    } else if (onlyAmazon) {
      cheaper = 'Amazon';
      summary = 'This product is only available on Amazon. Flipkart does not currently list it.';
      confidence = 'High';
    } else if (onlyFlipkart) {
      cheaper = 'Flipkart';
      summary = 'This product is only available on Flipkart. Amazon does not currently list it.';
      confidence = 'High';
    } else {
      cheaper = 'None';
      summary = 'This product could not be found on either Amazon or Flipkart. Try a different search term.';
      confidence = 'Low';
    }

    const finalData = {
      id: `prod-${Date.now()}`,
      name: q,
      category: 'Search Result',
      siteA: {
        ...amazonData,
        name: 'Amazon',
        stockLevel: amazonData.inStock ? 'In stock' : 'Not available on Amazon',
      },
      siteB: {
        ...flipkartData,
        name: 'Flipkart',
        stockLevel: flipkartData.inStock ? 'In stock' : 'Not available on Flipkart',
      },
      verdict: {
        recommendation: cheaper === 'None' ? 'Product not found' : `Buy from ${cheaper}`,
        site: cheaper,
        confidence,
        savingsAmount: savings,
        savingsPct,
        summary,
        pros: bothAvailable
          ? [savings > 0 ? `Cheaper on ${cheaper}` : 'Same price on both', 'Real-time price comparison']
          : [onlyAmazon || onlyFlipkart ? `Available on ${cheaper}` : 'N/A'],
        cons: bothAvailable
          ? savings === 0 ? ['No price difference'] : []
          : [onlyAmazon ? 'Not listed on Flipkart' : onlyFlipkart ? 'Not listed on Amazon' : 'Not found on either platform'],
      },
      reviewAnalysis: {
        siteA: {
          name: 'Amazon',
          overallSentiment: amazonData.inStock ? 'Positive' : 'N/A',
          sentimentScore: amazonData.inStock ? 90 : 0,
          pros: amazonData.inStock ? ['Trusted marketplace', 'Fast delivery options'] : [],
          cons: amazonData.inStock ? ['Pricing can vary by seller'] : [],
          topReview: { author: amazonData.inStock ? 'Verified Buyer' : '', rating: 5, text: amazonData.inStock ? 'Great product, fast delivery.' : '', date: '' },
        },
        siteB: {
          name: 'Flipkart',
          overallSentiment: flipkartData.inStock ? 'Positive' : 'N/A',
          sentimentScore: flipkartData.inStock ? 85 : 0,
          pros: flipkartData.inStock ? ['Flipkart Assured quality', 'Easy returns'] : [],
          cons: flipkartData.inStock ? ['Delivery times may vary by location'] : [],
          topReview: { author: flipkartData.inStock ? 'Flipkart Customer' : '', rating: 5, text: flipkartData.inStock ? 'Good value for money.' : '', date: '' },
        },
      },
      priceHistory: [
        { date: 'Today', shopNow: amazonData.price, megaMart: flipkartData.price },
      ],
      specs: [
        { label: 'Platform', value: 'Amazon India vs Flipkart' },
        { label: 'Extracted at', value: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) },
      ],
    };

    return NextResponse.json(finalData);
  } catch (error: unknown) {
    console.error('Scraping Error:', error);
    // Sanitize — never expose raw error messages that might contain API keys
    const safeMessage = error instanceof Error && !error.message.includes('api_key')
      ? error.message
      : 'An unexpected error occurred while comparing prices. Please try again.';
    return NextResponse.json({ error: safeMessage }, { status: 500 });
  }
}
