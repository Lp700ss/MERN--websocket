const WebSocket = require('ws');
const axios = require('axios'); // Import axios for making HTTP requests

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    handleMessage(message, ws);
  });

  // Handle initial authentication here
  // You can use the 'ws' object to track user authentication
  // For example:
  ws.isAuthenticated = true; // Set an authentication flag
});

async function fetchQuotesData() {
  try {
    // Fetch quotes data from the source
    const response = await axios.get('https://www.ambito.com/contenidos/dolar.html');
    // Parse response and extract data
    // For simplicity, let's assume the following structure
    const quotesData = {
      buy_price: 140.3,
      sell_price: 144,
      source: 'https://www.ambito.com/contenidos/dolar.html'
    };
    return quotesData;
  } catch (error) {
    console.error('Error fetching quotes data:', error);
    throw error;
  }
}

function calculateAverage(quotesArray) {
  // Calculate average buy and sell prices from the provided array of quotes
  // For simplicity, let's assume the quotesArray is an array of objects with 'buy_price' and 'sell_price' properties
  let totalBuyPrice = 0;
  let totalSellPrice = 0;
  
  quotesArray.forEach(quote => {
    totalBuyPrice += quote.buy_price;
    totalSellPrice += quote.sell_price;
  });
  
  const averageBuyPrice = totalBuyPrice / quotesArray.length;
  const averageSellPrice = totalSellPrice / quotesArray.length;

  return {
    average_buy_price: averageBuyPrice,
    average_sell_price: averageSellPrice
  };
}

function calculateSlippage(quotesArray, averageData) {
  // Calculate slippage for each quote and return an array of slippage objects
  // For simplicity, let's assume the quotesArray is an array of objects with 'buy_price' and 'sell_price' properties
  const slippageData = quotesArray.map(quote => {
    const buyPriceSlippage = (quote.buy_price - averageData.average_buy_price) / averageData.average_buy_price;
    const sellPriceSlippage = (quote.sell_price - averageData.average_sell_price) / averageData.average_sell_price;

    return {
      buy_price_slippage: buyPriceSlippage,
      sell_price_slippage: sellPriceSlippage,
      source: quote.source
    };
  });

  return slippageData;
}

async function handleMessage(message, ws) {
  try {
    const parsedMessage = JSON.parse(message);

    if (!ws.isAuthenticated) {
      ws.send(JSON.stringify({ error: 'Unauthorized: You are not authenticated.' }));
      return;
    }

    let response = {};

    switch (parsedMessage.endpoint) {
      case '/quotes':
        const quotesData = await fetchQuotesData();
        response = quotesData;
        break;

      case '/average':
        const quotesArray = await fetchQuotesData(); // Fetch quotes data
        const averageData = calculateAverage(quotesArray);
        response = averageData;
        break;

      case '/slippage':
        const quotesArrayForSlippage = await fetchQuotesData(); // Fetch quotes data
        const averageDataForSlippage = calculateAverage(quotesArrayForSlippage);
        const slippageData = calculateSlippage(quotesArrayForSlippage, averageDataForSlippage);
        response = slippageData;
        break;

      default:
        response = { error: 'Invalid endpoint' };
    }

    ws.send(JSON.stringify(response));
  } catch (error) {
    console.error('Error handling message:', error);
  }
}

module.exports = wss;
