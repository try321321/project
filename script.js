// TradingView chart
const widgetOptions = {
  debug: false,
  symbol: 'BTCUSD',
  interval: '60',
  container_id: 'tv_chart_container',
  // BEWARE: no trailing slash is expected in feed URL
  datafeed: new Datafeeds.UDFCompatibleDatafeed('http://localhost:3000'),
  library_path: 'charting_library/',
  locale: 'en',
  disabled_features: [
    'header_symbol_search',
    'header_compare',
    'header_undo_redo',
    'header_screenshot',
    'header_settings',
    'header_fullscreen_button',
    'header_resolutions',
    'header_indicators',
    'header_chart_type',
    'header_widget',
    'header_undo_all',
    'header_redo_all'
  ],
  enabled_features: ['study_templates'],
  charts_storage_url: 'http://saveload.tradingview.com',
  charts_storage_api_version: '1.1',
  client_id: 'tradingview.com',
  user_id: 'public_user_id',
  fullscreen: false,
  autosize: true,
  studies_overrides: {}
};

const widget = new TradingView.widget(widgetOptions);
widget.onChartReady(() => {
  console.log('Chart has loaded!');
});

// Handle the chart form submission
const chartForm = document.querySelector('#chart-form');
const assetSelect = chartForm.querySelector('#asset');

chartForm.addEventListener('submit', (event) => {
  event.preventDefault();
  
  // Get the selected asset from the select element
  const selectedAsset = assetSelect.value;

  // Update the widget symbol to the selected asset
  widgetOptions.symbol = selectedAsset;
  
  // Reload the page with the new chart
  window.location.reload();
});

// Calculate margin exposition
const marginSelect = document.querySelector('#margin');
const amountInput = document.querySelector('.amount-row input');
const priceDiv = document.querySelector('.price-row .price');
const balanceDiv = document.querySelector('.balance-row .balance');
const expositionDiv = document.querySelector('.exposition-row .exposition');
const buyButton = document.querySelector('.buy-button');
const sellButton = document.querySelector('.sell-button');

const calculateMarginExposition = () => {
  const marginType = marginSelect.value;
  const amount = parseFloat(amountInput.value);
  const price = parseFloat(priceDiv.innerText.slice(1));
  const balance = parseFloat(balanceDiv.innerText.slice(1).replace(/,/g, ''));
  const leverage = parseFloat(document.querySelector('.leverage-slider').value);
  const marginRatio = 1 / leverage;

  if (marginType === 'isolated') {
    const usedMargin = amount * price * marginRatio;
    const marginExposition = usedMargin / balance;
    expositionDiv.innerText = `Used margin: $${usedMargin.toFixed(2)} - Margin exposition: ${marginExposition.toFixed(4)}`;
  } else if (marginType === 'crossed') {
    const usedMargin = (balance * leverage) / price;
    const marginExposition = leverage;
    expositionDiv.innerText = `Used margin: $${usedMargin.toFixed(2)} - Margin exposition: ${marginExposition}x`;
  }
};

// Update margin exposition when inputs change
marginSelect.addEventListener('change', calculateMarginExposition);
amountInput.addEventListener('input', calculateMarginExposition);
document.querySelector('.leverage-slider').addEventListener('input', calculateMarginExposition);

// Buy and Sell buttons
buyButton.addEventListener('click', () => {
  alert('You clicked on the Buy button!');
});

sellButton.addEventListener('click', () => {
  alert('You clicked on the Sell button!');
});
