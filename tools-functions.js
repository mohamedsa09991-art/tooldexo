// ============================================
// TOOLS FUNCTIONS - COMPLETE EXAMPLE PATTERN
// ============================================
// This file shows the complete pattern for organizing all tool functions
// Extract and organize functions from your original file following this structure

// ============================================
// TEXT TOOLS
// ============================================

// Word Counter - Live text analysis
function updateWordCount() {
    const text = document.getElementById('wordCountText').value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
    const readingTime = Math.ceil(words.length / 200);

    document.getElementById('wordCount').textContent = words.length;
    document.getElementById('charCount').textContent = chars;
    document.getElementById('charCountNoSpace').textContent = charsNoSpace;
    document.getElementById('sentenceCount').textContent = sentences;
    document.getElementById('paragraphCount').textContent = paragraphs;
    document.getElementById('readingTime').textContent = readingTime;
}

// Case Converter
function convertCase(type) {
    const textarea = document.getElementById('caseText');
    let text = textarea.value;
    
    switch(type) {
        case 'upper':
            textarea.value = text.toUpperCase();
            break;
        case 'lower':
            textarea.value = text.toLowerCase();
            break;
        case 'title':
            textarea.value = text.toLowerCase().split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            break;
        case 'sentence':
            textarea.value = text.toLowerCase()
                .replace(/(^\w|\.\s+\w)/gm, letter => letter.toUpperCase());
            break;
    }
}

// Character Counter
function updateCharCounter() {
    const text = document.getElementById('charCounterText').value;
    const totalChars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const numbers = (text.match(/[0-9]/g) || []).length;
    
    document.getElementById('totalChars').textContent = totalChars;
    document.getElementById('charsNoSpaces').textContent = charsNoSpaces;
    document.getElementById('letters').textContent = letters;
    document.getElementById('numbers').textContent = numbers;
}

// ============================================
// CALCULATORS
// ============================================

// Percentage Calculator
function calculatePercentage() {
    const percent = parseFloat(document.getElementById('percentValue').value);
    const of = parseFloat(document.getElementById('percentOf').value);
    
    if (isNaN(percent) || isNaN(of)) {
        alert('Please enter valid numbers');
        return;
    }
    
    const result = (percent / 100) * of;
    document.getElementById('percentAnswer').textContent = result.toFixed(2);
    document.getElementById('percentResult').style.display = 'block';
}

// Age Calculator
function calculateAge() {
    const birthDate = new Date(document.getElementById('birthDate').value);
    if (isNaN(birthDate)) {
        alert('Please select a valid birth date');
        return;
    }
    
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    
    const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    
    document.getElementById('ageYears').textContent = years;
    document.getElementById('ageMonths').textContent = months;
    document.getElementById('ageDays').textContent = days;
    document.getElementById('totalDays').textContent = totalDays.toLocaleString();
    document.getElementById('totalHours').textContent = totalHours.toLocaleString();
    document.getElementById('totalMinutes').textContent = totalMinutes.toLocaleString();
    document.getElementById('ageResult').style.display = 'block';
}

// BMI Calculator
function calculateBMI() {
    const height = parseFloat(document.getElementById('bmiHeight').value);
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    
    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        alert('Please enter valid height and weight');
        return;
    }
    
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    
    let category, categoryClass, advice;
    
    if (bmi < 18.5) {
        category = 'Underweight';
        categoryClass = 'bmi-underweight';
        advice = 'Consider consulting with a healthcare provider about healthy weight gain strategies.';
    } else if (bmi < 25) {
        category = 'Normal Weight';
        categoryClass = 'bmi-normal';
        advice = 'Great! Maintain your healthy lifestyle with balanced diet and regular exercise.';
    } else if (bmi < 30) {
        category = 'Overweight';
        categoryClass = 'bmi-overweight';
        advice = 'Consider a balanced diet and increased physical activity. Consult a healthcare provider.';
    } else {
        category = 'Obese';
        categoryClass = 'bmi-obese';
        advice = 'We recommend consulting with a healthcare provider for personalized guidance.';
    }
    
    document.getElementById('bmiValue').textContent = bmi.toFixed(1);
    document.getElementById('bmiCategory').textContent = category;
    document.getElementById('bmiCategory').className = 'bmi-category ' + categoryClass;
    document.getElementById('bmiAdvice').textContent = advice;
    document.getElementById('bmiResult').style.display = 'block';
    
    saveToHistory('BMI Calculator', `${height}cm, ${weight}kg`, bmi.toFixed(1));
}

// ============================================
// CONVERTERS
// ============================================

// Unit Converter
function updateUnitOptions() {
    const unitType = document.getElementById('unitType').value;
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    const unitNames = Object.keys(UNITS[unitType]);
    unitNames.forEach(unit => {
        fromUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
        toUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
    });
    
    toUnit.selectedIndex = 1;
}

function convertUnits() {
    const unitType = document.getElementById('unitType').value;
    const fromValue = parseFloat(document.getElementById('fromValue').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    
    if (isNaN(fromValue)) {
        document.getElementById('toValue').value = '';
        return;
    }
    
    let result;
    if (unitType === 'temperature') {
        const celsius = UNITS.temperature[fromUnit].toCelsius(fromValue);
        result = UNITS.temperature[toUnit].fromCelsius(celsius);
    } else {
        const baseValue = fromValue / UNITS[unitType][fromUnit];
        result = baseValue * UNITS[unitType][toUnit];
    }
    
    document.getElementById('toValue').value = result.toFixed(4);
}

// Currency Converter with Live API
async function fetchExchangeRates() {
    const now = Date.now();
    
    if (Object.keys(exchangeRates).length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
        return;
    }
    
    try {
        const response = await fetch('https://api.frankfurter.app/latest?from=USD');
        const data = await response.json();
        exchangeRates = { USD: 1, ...data.rates };
        lastFetchTime = now;
        console.log('✅ Exchange rates updated');
    } catch (error) {
        console.error('Currency API error:', error);
        exchangeRates = {
            USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.50
        };
    }
}

async function convertCurrency() {
    const amount = parseFloat(document.getElementById('currencyAmount').value);
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    
    if (isNaN(amount) || amount < 0) {
        document.getElementById('currencyResult').style.display = 'none';
        return;
    }
    
    await fetchExchangeRates();
    
    const usdAmount = amount / exchangeRates[from];
    const result = usdAmount * exchangeRates[to];
    
    document.getElementById('currencyOutput').textContent = 
        `${amount.toFixed(2)} ${from} = ${result.toFixed(2)} ${to}`;
    document.getElementById('currencyResult').style.display = 'block';
}

// ============================================
// GENERATORS
// ============================================

// Password Generator
function generatePassword() {
    const length = document.getElementById('passwordLength').value;
    const includeUpper = document.getElementById('includeUpper').checked;
    const includeLower = document.getElementById('includeLower').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    
    let chars = '';
    if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (chars === '') {
        alert('Please select at least one character type');
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    document.getElementById('generatedPassword').textContent = password;
    document.getElementById('passwordResult').style.display = 'block';
}

function copyPassword() {
    const password = document.getElementById('generatedPassword').textContent;
    copyToClipboard(password);
}

// QR Code Generator (Simple version - you may want to use a library)
function generateQR() {
    const text = document.getElementById('qrText').value;
    if (!text) {
        alert('Please enter text or URL');
        return;
    }
    
    // Use a QR code library or API here
    // This is a placeholder showing the structure
    const canvas = document.getElementById('qrcode');
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;
    
    // Draw QR code (simplified - use proper library in production)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 300, 300);
    ctx.fillStyle = 'black';
    
    document.getElementById('qrContainer').style.display = 'block';
}

// Color Picker
function updateColorCodes() {
    const color = document.getElementById('colorInput').value;
    const display = document.getElementById('colorDisplay');
    
    display.style.backgroundColor = color;
    document.getElementById('hexCode').textContent = color.toUpperCase();
    
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
    
    document.getElementById('rgbCode').textContent = `rgb(${r}, ${g}, ${b})`;
    
    const hsl = rgbToHsl(r, g, b);
    document.getElementById('hslCode').textContent = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// Lorem Ipsum Generator
function generateLorem() {
    const count = parseInt(document.getElementById('loremCount').value);
    let text = '';
    
    for (let i = 0; i < count; i++) {
        text += LOREM_PARAGRAPHS[i % LOREM_PARAGRAPHS.length] + '\n\n';
    }
    
    document.getElementById('loremText').textContent = text.trim();
    document.getElementById('loremResult').style.display = 'block';
}

function copyLorem() {
    const text = document.getElementById('loremText').textContent;
    copyToClipboard(text);
}

// ============================================
// DEVELOPER TOOLS
// ============================================

// JSON Formatter
function formatJSON() {
    try {
        const json = JSON.parse(document.getElementById('jsonInput').value);
        const formatted = JSON.stringify(json, null, 2);
        document.getElementById('jsonOutput').textContent = formatted;
        document.getElementById('jsonResult').style.display = 'block';
    } catch (e) {
        alert('Invalid JSON: ' + e.message);
    }
}

function minifyJSON() {
    try {
        const json = JSON.parse(document.getElementById('jsonInput').value);
        const minified = JSON.stringify(json);
        document.getElementById('jsonOutput').textContent = minified;
        document.getElementById('jsonResult').style.display = 'block';
    } catch (e) {
        alert('Invalid JSON: ' + e.message);
    }
}

// Base64 Encoder/Decoder
function encodeBase64() {
    const text = document.getElementById('base64Input').value;
    if (!text) {
        alert('Please enter text to encode');
        return;
    }
    const encoded = btoa(text);
    document.getElementById('base64Output').textContent = encoded;
    document.getElementById('base64Result').style.display = 'block';
}

function decodeBase64() {
    const text = document.getElementById('base64Input').value;
    if (!text) {
        alert('Please enter Base64 to decode');
        return;
    }
    try {
        const decoded = atob(text);
        document.getElementById('base64Output').textContent = decoded;
        document.getElementById('base64Result').style.display = 'block';
    } catch (e) {
        alert('Invalid Base64 string');
    }
}

function copyBase64() {
    const text = document.getElementById('base64Output').textContent;
    copyToClipboard(text);
}

// ============================================
// CONTINUE WITH ALL OTHER TOOLS...
// Follow the same pattern for remaining tools
// ============================================

console.log('Tools functions loaded successfully');
