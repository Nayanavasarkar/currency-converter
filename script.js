// Exchange rates (demo data - in real app, fetch from API)
const exchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.0,
    INR: 74.5,
    AUD: 1.35,
    CAD: 1.25,
    CHF: 0.92
};

// Get DOM elements
const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('fromCurrency');
const toSelect = document.getElementById('toCurrency');
const swapBtn = document.getElementById('swapBtn');
const convertBtn = document.getElementById('convertBtn');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');

// Convert currency function
function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;
    
    // Validate input
    if (!amount || amount <= 0) {
        showError('Please enter a valid amount');
        return;
    }
    
    // Show loading
    showLoading();
    hideError();
    
    // Simulate API delay
    setTimeout(() => {
        try {
            let result;
            
            if (fromCurrency === toCurrency) {
                result = amount;
            } else {
                // Convert through USD as base
                const usdAmount = amount / exchangeRates[fromCurrency];
                result = usdAmount * exchangeRates[toCurrency];
            }
            
            // Display result
            showResult(amount, fromCurrency, result, toCurrency);
            hideLoading();
            
        } catch (error) {
            showError('Conversion failed. Please try again.');
            hideLoading();
        }
    }, 500);
}

// Swap currencies
function swapCurrencies() {
    const fromValue = fromSelect.value;
    const toValue = toSelect.value;
    
    fromSelect.value = toValue;
    toSelect.value = fromValue;
    
    // Auto convert if amount exists
    if (amountInput.value && amountInput.value > 0) {
        convertCurrency();
    }
}

// Show result
function showResult(amount, fromCurrency, result, toCurrency) {
    const rate = (result / amount).toFixed(4);
    
    resultDiv.innerHTML = `
        <p><strong>${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}</strong></p>
        <p style="font-size: 14px; color: #666; margin-top: 10px;">
            1 ${fromCurrency} = ${rate} ${toCurrency}
        </p>
    `;
}

// Show loading
function showLoading() {
    loadingDiv.style.display = 'block';
    resultDiv.style.display = 'none';
    convertBtn.disabled = true;
}

// Hide loading
function hideLoading() {
    loadingDiv.style.display = 'none';
    resultDiv.style.display = 'flex';
    convertBtn.disabled = false;
}

// Show error
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        hideError();
    }, 3000);
}

// Hide error
function hideError() {
    errorDiv.style.display = 'none';
}

// Event listeners
convertBtn.addEventListener('click', convertCurrency);
swapBtn.addEventListener('click', swapCurrencies);

// Auto convert on input change
amountInput.addEventListener('input', function() {
    if (this.value && this.value > 0) {
        // Debounce - wait 1 second after user stops typing
        clearTimeout(window.convertTimeout);
        window.convertTimeout = setTimeout(convertCurrency, 1000);
    }
});

// Auto convert when currency changes
fromSelect.addEventListener('change', function() {
    if (amountInput.value && amountInput.value > 0) {
        convertCurrency();
    }
});

toSelect.addEventListener('change', function() {
    if (amountInput.value && amountInput.value > 0) {
        convertCurrency();
    }
});

// Load exchange rates from API (optional)
async function loadRealExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        // Update rates if API call successful
        Object.assign(exchangeRates, data.rates);
        console.log('Live exchange rates loaded successfully');
        
    } catch (error) {
        console.log('Using demo rates - API unavailable');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Currency Converter loaded');
    loadRealExchangeRates(); // Try to load real rates, fallback to demo rates
});