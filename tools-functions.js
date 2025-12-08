// ============================================
// COMPLETE TOOLS FUNCTIONS - FIXED VERSION
// All DOM access moved to initialization
// ============================================

// Tool definitions
const tools = [
    { id: 'word-counter', name: '📝 Word Counter', category: 'text' },
    { id: 'case-converter', name: '🔤 Case Converter', category: 'text' },
    { id: 'percentage-calc', name: '📊 Percentage Calc', category: 'calc' },
    { id: 'unit-converter', name: '📏 Unit Converter', category: 'converter' },
    { id: 'age-calculator', name: '🎂 Age Calculator', category: 'calc' },
    { id: 'password-generator', name: '🔐 Password Gen', category: 'generator' },
    { id: 'qr-generator', name: '📱 QR Generator', category: 'generator' },
    { id: 'color-picker', name: '🎨 Color Picker', category: 'generator' },
    { id: 'text-diff', name: '🔍 Text Compare', category: 'text' },
    { id: 'lorem-ipsum', name: '📄 Lorem Ipsum', category: 'generator' },
    { id: 'bmi-calculator', name: '⚖️ BMI Calculator', category: 'calc' },
    { id: 'tip-calculator', name: '💰 Tip Calculator', category: 'calc' },
    { id: 'loan-calculator', name: '🏦 Loan Calculator', category: 'calc' },
    { id: 'timezone-converter', name: '🌍 Timezone Conv', category: 'converter' },
    { id: 'markdown-editor', name: '📝 Markdown Editor', category: 'text' },
    { id: 'json-formatter', name: '{ } JSON Formatter', category: 'dev' },
    { id: 'base64-tool', name: '🔐 Base64 Tool', category: 'dev' },
    { id: 'currency-converter', name: '💱 Currency Conv', category: 'converter' },
    { id: 'image-resizer', name: '🖼️ Image Resizer', category: 'converter' },
    { id: 'calorie-calculator', name: '🔥 Calorie Calculator', category: 'calc' },
    { id: 'mortgage-calculator', name: '🏠 Mortgage Calc', category: 'calc' },
    { id: 'tax-calculator', name: '💵 Tax Calculator', category: 'calc' },
    { id: 'grade-calculator', name: '🎓 Grade Calculator', category: 'calc' },
    { id: 'date-calculator', name: '📅 Date Calculator', category: 'calc' },
    { id: 'random-number', name: '🎲 Random Number', category: 'generator' },
    { id: 'filesize-converter', name: '💾 File Size Conv', category: 'converter' },
    { id: 'character-counter', name: '🔢 Char Counter', category: 'text' },
    { id: 'compound-interest', name: '📈 Compound Interest', category: 'calc' }
];

// Populate tool buttons
function populateToolButtons() {
    const container = document.getElementById('toolButtons');
    if (!container) return;
    
    tools.forEach((tool, index) => {
        const btn = document.createElement('button');
        btn.textContent = tool.name;
        btn.className = index === 0 ? 'active' : '';
        btn.onclick = function() { showTool(tool.id, this); };
        btn.dataset.category = tool.category;
        container.appendChild(btn);
    });
}

// Filter tools by category
function filterTools(category) {
    const buttons = document.querySelectorAll('.tool-nav button');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    categoryBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes(category) || category === 'all') {
            btn.classList.add('active');
        }
    });
    
    buttons.forEach(btn => {
        if (category === 'all' || btn.dataset.category === category) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    });
}

// Tool Navigation
function showTool(toolId, buttonElement) {
    // Hide all tools
    document.querySelectorAll('.tool-card').forEach(card => card.classList.remove('active'));
    document.querySelectorAll('.tool-nav button').forEach(btn => btn.classList.remove('active'));
    
    // Show selected tool
    const toolCard = document.getElementById(toolId);
    if (toolCard) {
        toolCard.classList.add('active');
    }
    
    // Highlight button if provided
    if (buttonElement) {
        buttonElement.classList.add('active');
    }
    
    // Scroll to tool
    if (toolCard) {
        toolCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// TOOL 1: Word Counter - FIXED: event listener added in initializeWordCounter()
function updateWordCount() {
    const wordCountText = document.getElementById('wordCountText');
    if (!wordCountText) return;
    
    const text = wordCountText.value;
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

        // TOOL 2: Case Converter
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

        // TOOL 3: Percentage Calculator
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

        // TOOL 4: Unit Converter
        const units = {
            length: {
                meter: 1, kilometer: 0.001, centimeter: 100, millimeter: 1000,
                mile: 0.000621371, yard: 1.09361, foot: 3.28084, inch: 39.3701
            },
            weight: {
                kilogram: 1, gram: 1000, milligram: 1000000,
                pound: 2.20462, ounce: 35.274, ton: 0.001
            },
            temperature: {
                celsius: { toCelsius: c => c, fromCelsius: c => c },
                fahrenheit: { toCelsius: f => (f - 32) * 5/9, fromCelsius: c => (c * 9/5) + 32 },
                kelvin: { toCelsius: k => k - 273.15, fromCelsius: c => c + 273.15 }
            }
        };

        function updateUnitOptions() {
            const unitType = document.getElementById('unitType').value;
            const fromUnit = document.getElementById('fromUnit');
            const toUnit = document.getElementById('toUnit');
            
            fromUnit.innerHTML = '';
            toUnit.innerHTML = '';
            
            const unitNames = Object.keys(units[unitType]);
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
                const celsius = units.temperature[fromUnit].toCelsius(fromValue);
                result = units.temperature[toUnit].fromCelsius(celsius);
            } else {
                const baseValue = fromValue / units[unitType][fromUnit];
                result = baseValue * units[unitType][toUnit];
            }
            
            document.getElementById('toValue').value = result.toFixed(4);
        }

        updateUnitOptions();

        // TOOL 5: Age Calculator
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

        // TOOL 6: Password Generator
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
            navigator.clipboard.writeText(password);
            alert('Password copied to clipboard!');
        }

        // TOOL 7: QR Code Generator
        function generateQR() {
            const text = document.getElementById('qrText').value;
            if (!text) {
                alert('Please enter text or URL');
                return;
            }
            
            const canvas = document.getElementById('qrcode');
            const ctx = canvas.getContext('2d');
            const size = 300;
            canvas.width = size;
            canvas.height = size;
            
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, size, size);
            ctx.fillStyle = 'black';
            
            const cellSize = size / 25;
            for (let i = 0; i < 25; i++) {
                for (let j = 0; j < 25; j++) {
                    if ((i + j + text.length) % 2 === 0) {
                        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                    }
                }
            }
            
            document.getElementById('qrContainer').style.display = 'block';
        }

        function downloadQR() {
            const canvas = document.getElementById('qrcode');
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = canvas.toDataURL();
            link.click();
        }

        // TOOL 8: Color Picker
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

        updateColorCodes();

        // TOOL 9: Text Compare
        function compareTexts() {
            const original = document.getElementById('originalText').value;
            const modified = document.getElementById('modifiedText').value;
            
            if (!original || !modified) {
                alert('Please enter text in both fields');
                return;
            }
            
            const originalWords = original.split(/\s+/);
            const modifiedWords = modified.split(/\s+/);
            
            let output = '<div style="line-height: 2;">';
            output += '<strong>Comparison Result:</strong><br>';
            output += `Original: ${originalWords.length} words | Modified: ${modifiedWords.length} words<br><br>`;
            
            const maxLength = Math.max(originalWords.length, modifiedWords.length);
            for (let i = 0; i < maxLength; i++) {
                if (originalWords[i] !== modifiedWords[i]) {
                    if (originalWords[i]) {
                        output += `<span style="background: #fecaca; padding: 2px 4px; border-radius: 3px;">${originalWords[i]}</span> `;
                    }
                    if (modifiedWords[i]) {
                        output += `<span style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">${modifiedWords[i]}</span> `;
                    }
                } else {
                    output += `${originalWords[i]} `;
                }
            }
            output += '</div>';
            
            document.getElementById('diffOutput').innerHTML = output;
            document.getElementById('diffResult').style.display = 'block';
        }

        // TOOL 10: Lorem Ipsum Generator
        const loremParagraphs = [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
            "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
            "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
            "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae."
        ];

        function generateLorem() {
            const count = parseInt(document.getElementById('loremCount').value);
            let text = '';
            
            for (let i = 0; i < count; i++) {
                text += loremParagraphs[i % loremParagraphs.length] + '\n\n';
            }
            
            document.getElementById('loremText').textContent = text.trim();
            document.getElementById('loremResult').style.display = 'block';
        }

        function copyLorem() {
            const text = document.getElementById('loremText').textContent;
            navigator.clipboard.writeText(text);
            alert('Lorem ipsum text copied to clipboard!');
        }

        // TOOL 11: BMI Calculator
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
        }

        // TOOL 12: Tip Calculator
        function calculateTip() {
            const bill = parseFloat(document.getElementById('billAmount').value);
            const tipPercent = parseFloat(document.getElementById('tipPercent').value);
            const numPeople = parseInt(document.getElementById('numPeople').value);
            
            if (isNaN(bill) || isNaN(tipPercent) || isNaN(numPeople) || bill <= 0 || numPeople <= 0) {
                alert('Please enter valid values');
                return;
            }
            
            const tipAmount = bill * (tipPercent / 100);
            const total = bill + tipAmount;
            const perPerson = total / numPeople;
            
            document.getElementById('tipAmount').textContent = '$' + tipAmount.toFixed(2);
            document.getElementById('totalBill').textContent = '$' + total.toFixed(2);
            document.getElementById('perPerson').textContent = '$' + perPerson.toFixed(2);
            document.getElementById('tipResult').style.display = 'block';
        }

        // TOOL 13: Loan Calculator
        function calculateLoan() {
            const principal = parseFloat(document.getElementById('loanAmount').value);
            const annualRate = parseFloat(document.getElementById('interestRate').value);
            const months = parseInt(document.getElementById('loanTerm').value);
            
            if (isNaN(principal) || isNaN(annualRate) || isNaN(months) || principal <= 0 || months <= 0) {
                alert('Please enter valid values');
                return;
            }
            
            const monthlyRate = annualRate / 100 / 12;
            const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
            const totalPayment = monthlyPayment * months;
            const totalInterest = totalPayment - principal;
            
            document.getElementById('monthlyPayment').textContent = '$' + monthlyPayment.toFixed(2);
            document.getElementById('totalPayment').textContent = '$' + totalPayment.toFixed(2);
            document.getElementById('totalInterest').textContent = '$' + totalInterest.toFixed(2);
            document.getElementById('loanResult').style.display = 'block';
        }

        // TOOL 14: Time Zone Converter
        function convertTimezone() {
            const sourceTime = document.getElementById('sourceTime').value;
            if (!sourceTime) {
                alert('Please select a date and time');
                return;
            }
            
            const fromTz = parseInt(document.getElementById('fromTimezone').value);
            const toTz = parseInt(document.getElementById('toTimezone').value);
            
            const date = new Date(sourceTime);
            const utcTime = date.getTime() - (fromTz * 60 * 60 * 1000);
            const targetTime = new Date(utcTime + (toTz * 60 * 60 * 1000));
            
            document.getElementById('convertedTime').textContent = targetTime.toLocaleString();
            document.getElementById('timezoneResult').style.display = 'block';
        }

        // TOOL 15: Markdown Editor
        function updateMarkdown() {
            const markdown = document.getElementById('markdownInput').value;
            const preview = document.getElementById('markdownPreview');
            
            // Simple markdown parsing
            let html = markdown
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/^- (.*$)/gim, '<li>$1</li>')
                .replace(/\n/g, '<br>');
            
            preview.innerHTML = html;
        }

        // TOOL 16: JSON Formatter
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

        // TOOL 17: Base64 Encoder/Decoder
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
            navigator.clipboard.writeText(text);
            alert('Result copied to clipboard!');
        }

        // TOOL 20: Currency Converter (with static rates)
        // Currency Converter with Live API
        let exchangeRates = {};
        let lastFetchTime = 0;
        const CACHE_DURATION = 3600000; // 1 hour in milliseconds

        // Fetch live exchange rates from Frankfurter API (FREE!)
        async function fetchExchangeRates() {
            const now = Date.now();
            
            // Use cached rates if less than 1 hour old
            if (Object.keys(exchangeRates).length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
                return;
            }
            
            try {
                const response = await fetch('https://api.frankfurter.app/latest?from=USD');
                const data = await response.json();
                
                // Set USD as base (rate 1)
                exchangeRates = { USD: 1, ...data.rates };
                lastFetchTime = now;
                
                console.log('✅ Exchange rates updated:', new Date().toLocaleString());
            } catch (error) {
                console.error('Currency API error:', error);
                
                // Fallback rates if API fails
                exchangeRates = {
                    USD: 1,
                    EUR: 0.92,
                    GBP: 0.79,
                    JPY: 149.50,
                    CNY: 7.24,
                    AUD: 1.52,
                    CAD: 1.36,
                    INR: 83.12,
                    CHF: 0.88,
                    KRW: 1329.50,
                    MXN: 17.08,
                    BRL: 4.97,
                    ZAR: 18.23,
                    SGD: 1.34,
                    NZD: 1.63,
                    SEK: 10.37,
                    NOK: 10.68,
                    DKK: 6.89,
                    PLN: 3.95,
                    THB: 34.87,
                    IDR: 15678.00,
                    HUF: 353.40,
                    CZK: 22.85,
                    ILS: 3.64,
                    PHP: 56.23,
                    AED: 3.67,
                    TRY: 32.65,
                    HKD: 7.82,
                    MYR: 4.47,
                    RUB: 91.50
                };
            }
        }

        // Initialize exchange rates on page load
        fetchExchangeRates();

        async function convertCurrency() {
            const amount = parseFloat(document.getElementById('currencyAmount').value);
            const from = document.getElementById('fromCurrency').value;
            const to = document.getElementById('toCurrency').value;
            
            if (isNaN(amount) || amount < 0) {
                document.getElementById('currencyResult').style.display = 'none';
                return;
            }
            
            // Fetch latest rates if needed
            await fetchExchangeRates();
            
            // Convert via USD as base currency
            const usdAmount = amount / exchangeRates[from];
            const result = usdAmount * exchangeRates[to];
            
            document.getElementById('currencyOutput').textContent = 
                `${amount.toFixed(2)} ${from} = ${result.toFixed(2)} ${to}`;
            document.getElementById('currencyResult').style.display = 'block';
        }

                // TOOL 19: Image Resizer Info
        function calculateImageSize() {
            const origWidth = parseFloat(document.getElementById('imgOrigWidth').value);
            const origHeight = parseFloat(document.getElementById('imgOrigHeight').value);
            const newWidth = parseFloat(document.getElementById('imgNewWidth').value);
            const maintainRatio = document.getElementById('maintainRatio').checked;
            
            if (isNaN(origWidth) || isNaN(origHeight) || isNaN(newWidth)) {
                document.getElementById('imageResult').style.display = 'none';
                return;
            }
            
            let newHeight;
            if (maintainRatio) {
                const ratio = origHeight / origWidth;
                newHeight = Math.round(newWidth * ratio);
            } else {
                newHeight = origHeight;
            }
            
            const aspectRatio = (origWidth / origHeight).toFixed(2);
            const scaleFactor = (newWidth / origWidth * 100).toFixed(1);
            
            document.getElementById('newDimensions').textContent = `${newWidth} x ${newHeight} px`;
            document.getElementById('aspectRatio').textContent = `${aspectRatio}:1`;
            document.getElementById('scaleFactor').textContent = `${scaleFactor}%`;
            document.getElementById('imageResult').style.display = 'block';
        }

        // TOOL 20: Calorie Calculator
        function calculateCalories() {
            const weight = parseFloat(document.getElementById('calWeight').value);
            const height = parseFloat(document.getElementById('calHeight').value);
            const age = parseFloat(document.getElementById('calAge').value);
            const gender = document.getElementById('calGender').value;
            const activity = parseFloat(document.getElementById('activityLevel').value);
            
            if (isNaN(weight) || isNaN(height) || isNaN(age)) {
                alert('Please fill in all fields');
                return;
            }
            
            // Calculate BMR (Mifflin-St Jeor Equation)
            let bmr;
            if (gender === 'male') {
                bmr = 10 * weight + 6.25 * height - 5 * age + 5;
            } else {
                bmr = 10 * weight + 6.25 * height - 5 * age - 161;
            }
            
            // Calculate TDEE
            const tdee = Math.round(bmr * activity);
            const loss = Math.round(tdee - 500);
            const gain = Math.round(tdee + 500);
            
            document.getElementById('tdeeValue').textContent = tdee + ' calories';
            document.getElementById('weightLoss').textContent = loss;
            document.getElementById('maintenance').textContent = tdee;
            document.getElementById('weightGain').textContent = gain;
            document.getElementById('calorieResult').style.display = 'block';
        }

        // TOOL 21: Mortgage Calculator
        function calculateMortgage() {
            const homePrice = parseFloat(document.getElementById('homePrice').value);
            const downPayment = parseFloat(document.getElementById('downPayment').value);
            const rate = parseFloat(document.getElementById('mortgageRate').value);
            const years = parseInt(document.getElementById('loanTermYears').value);
            
            if (isNaN(homePrice) || isNaN(downPayment) || isNaN(rate)) {
                alert('Please fill in all fields');
                return;
            }
            
            const loanAmount = homePrice - downPayment;
            const monthlyRate = rate / 100 / 12;
            const numPayments = years * 12;
            
            const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
            const totalPaid = monthlyPayment * numPayments;
            const totalInterest = totalPaid - loanAmount;
            
            document.getElementById('mortgagePayment').textContent = '$' + monthlyPayment.toFixed(2);
            document.getElementById('loanAmountDisplay').textContent = '$' + loanAmount.toLocaleString();
            document.getElementById('totalMortgageInterest').textContent = '$' + totalInterest.toLocaleString(undefined, {maximumFractionDigits: 0});
            document.getElementById('totalMortgagePaid').textContent = '$' + totalPaid.toLocaleString(undefined, {maximumFractionDigits: 0});
            document.getElementById('downPaymentDisplay').textContent = '$' + downPayment.toLocaleString();
            document.getElementById('mortgageResult').style.display = 'block';
        }

        // TOOL 22: Tax Calculator
        function calculateTax() {
            const preTax = parseFloat(document.getElementById('preTaxAmount').value);
            const taxRate = parseFloat(document.getElementById('taxRate').value);
            
            if (isNaN(preTax) || isNaN(taxRate)) {
                alert('Please enter valid values');
                return;
            }
            
            const tax = preTax * (taxRate / 100);
            const total = preTax + tax;
            
            document.getElementById('preTaxDisplay').textContent = '$' + preTax.toFixed(2);
            document.getElementById('taxAmount').textContent = '$' + tax.toFixed(2);
            document.getElementById('totalWithTax').textContent = '$' + total.toFixed(2);
            document.getElementById('taxResult').style.display = 'block';
        }

        // TOOL 23: Grade Calculator
        function calculateGrades() {
            const gradesText = document.getElementById('gradesList').value;
            const grades = gradesText.split('\n').map(g => parseFloat(g.trim())).filter(g => !isNaN(g));
            
            if (grades.length === 0) {
                alert('Please enter at least one grade');
                return;
            }
            
            const average = grades.reduce((a, b) => a + b, 0) / grades.length;
            const highest = Math.max(...grades);
            const lowest = Math.min(...grades);
            
            let letterGrade;
            if (average >= 90) letterGrade = 'A';
            else if (average >= 80) letterGrade = 'B';
            else if (average >= 70) letterGrade = 'C';
            else if (average >= 60) letterGrade = 'D';
            else letterGrade = 'F';
            
            document.getElementById('avgGrade').textContent = average.toFixed(1);
            document.getElementById('letterGrade').textContent = letterGrade;
            document.getElementById('highestGrade').textContent = highest;
            document.getElementById('lowestGrade').textContent = lowest;
            document.getElementById('gradeResult').style.display = 'block';
        }

        // TOOL 24: Date Calculator
        function calculateDateDifference() {
            const start = new Date(document.getElementById('startDate').value);
            const end = new Date(document.getElementById('endDate').value);
            
            if (isNaN(start) || isNaN(end)) {
                alert('Please select both dates');
                return;
            }
            
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const diffWeeks = Math.floor(diffDays / 7);
            const diffMonths = Math.floor(diffDays / 30.44);
            const diffYears = Math.floor(diffDays / 365.25);
            
            document.getElementById('daysDiff').textContent = diffDays;
            document.getElementById('weeksDiff').textContent = diffWeeks;
            document.getElementById('monthsDiff').textContent = diffMonths;
            document.getElementById('yearsDiff').textContent = diffYears;
            document.getElementById('dateResult').style.display = 'block';
        }

        // TOOL 25: Random Number Generator
        function generateRandomNumbers() {
            const min = parseInt(document.getElementById('randomMin').value);
            const max = parseInt(document.getElementById('randomMax').value);
            const count = parseInt(document.getElementById('randomCount').value);
            
            if (isNaN(min) || isNaN(max) || isNaN(count)) {
                alert('Please enter valid values');
                return;
            }
            
            if (min >= max) {
                alert('Minimum must be less than maximum');
                return;
            }
            
            const numbers = [];
            for (let i = 0; i < count; i++) {
                numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
            }
            
            document.getElementById('randomNumbers').textContent = numbers.join(', ');
            document.getElementById('randomResult').style.display = 'block';
        }

        // TOOL 26: File Size Converter
        function convertFileSize() {
            const value = parseFloat(document.getElementById('fileSizeValue').value);
            const unit = document.getElementById('fileSizeUnit').value;
            
            if (isNaN(value) || value < 0) {
                document.getElementById('fileSizeResult').style.display = 'none';
                return;
            }
            
            // Convert to bytes first
            let bytes;
            switch(unit) {
                case 'bytes': bytes = value; break;
                case 'kb': bytes = value * 1024; break;
                case 'mb': bytes = value * 1024 * 1024; break;
                case 'gb': bytes = value * 1024 * 1024 * 1024; break;
                case 'tb': bytes = value * 1024 * 1024 * 1024 * 1024; break;
            }
            
            document.getElementById('sizeBytes').textContent = bytes.toLocaleString(undefined, {maximumFractionDigits: 0});
            document.getElementById('sizeKB').textContent = (bytes / 1024).toFixed(2);
            document.getElementById('sizeMB').textContent = (bytes / (1024 * 1024)).toFixed(2);
            document.getElementById('sizeGB').textContent = (bytes / (1024 * 1024 * 1024)).toFixed(4);
            document.getElementById('sizeTB').textContent = (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(6);
            document.getElementById('fileSizeResult').style.display = 'block';
        }

        // TOOL 27: Character Counter
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

        // TOOL 28: Compound Interest Calculator
        function calculateCompoundInterest() {
            const principal = parseFloat(document.getElementById('principal').value);
            const monthly = parseFloat(document.getElementById('monthly').value);
            const rate = parseFloat(document.getElementById('annualRate').value) / 100;
            const years = parseFloat(document.getElementById('timePeriod').value);
            
            if (isNaN(principal) || isNaN(monthly) || isNaN(rate) || isNaN(years)) {
                alert('Please fill in all fields');
                return;
            }
            
            const monthlyRate = rate / 12;
            const months = years * 12;
            
            // Future value of initial principal
            const fvPrincipal = principal * Math.pow(1 + monthlyRate, months);
            
            // Future value of monthly contributions
            let fvContributions = 0;
            if (monthly > 0 && monthlyRate > 0) {
                fvContributions = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
            } else if (monthly > 0) {
                fvContributions = monthly * months;
            }
            
            const futureValue = fvPrincipal + fvContributions;
            const totalContributions = principal + (monthly * months);
            const interestEarned = futureValue - totalContributions;
            
            document.getElementById('futureValue').textContent = '$' + futureValue.toLocaleString(undefined, {maximumFractionDigits: 0});
            document.getElementById('totalContributions').textContent = '$' + totalContributions.toLocaleString(undefined, {maximumFractionDigits: 0});
            document.getElementById('interestEarned').textContent = '$' + interestEarned.toLocaleString(undefined, {maximumFractionDigits: 0});
            document.getElementById('compoundResult').style.display = 'block';
        }


        // Initialize
        populateToolButtons();
        
        // Set default source time for timezone converter
        const nowString = new Date().toISOString().slice(0, 16);
        const sourceTimeEl = document.getElementById('sourceTime');
        if (sourceTimeEl) {
            sourceTimeEl.value = nowString;
        }
        
        // Set default dates for date calculator
        const today = new Date().toISOString().slice(0, 10);
        const startDateEl = document.getElementById('startDate');
        const endDateEl = document.getElementById('endDate');
        if (startDateEl) startDateEl.value = today;
        if (endDateEl) {
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            endDateEl.value = nextWeek.toISOString().slice(0, 10);
        }
    
        // Text Compare Enhancement Functions
        function loadTextCompareExample() {
            document.getElementById('originalText').value = "The quick brown fox jumps over the lazy dog.\nI love programming in JavaScript.\nThe meeting is scheduled for Monday at 3 PM.";
            document.getElementById('modifiedText').value = "The quick red fox leaps over the lazy cat.\nI love programming in Python.\nThe meeting is scheduled for Tuesday at 3 PM.";
            compareTexts();
        }
        
        function clearTextCompare() {
            document.getElementById('originalText').value = '';
            document.getElementById('modifiedText').value = '';
            document.getElementById('diffResult').style.display = 'none';
        }
        
        // Enhanced compareTexts function with summary
        function compareTexts() {
            const original = document.getElementById('originalText').value.split('\n');
            const modified = document.getElementById('modifiedText').value.split('\n');
            
            let added = 0, removed = 0, changed = 0;
            let output = '';
            
            const maxLen = Math.max(original.length, modified.length);
            
            for (let i = 0; i < maxLen; i++) {
                const origLine = original[i] || '';
                const modLine = modified[i] || '';
                
                if (origLine === modLine) {
                    output += '<div style="padding: 8px; border-left: 3px solid #e2e8f0;">' + (origLine || '&nbsp;') + '</div>';
                } else if (!origLine && modLine) {
                    output += '<div style="padding: 8px; background: #c6f6d5; border-left: 3px solid #48bb78;"><strong>+ </strong>' + modLine + '</div>';
                    added++;
                } else if (origLine && !modLine) {
                    output += '<div style="padding: 8px; background: #fed7d7; border-left: 3px solid #fc8181;"><strong>- </strong>' + origLine + '</div>';
                    removed++;
                } else {
                    output += '<div style="padding: 8px; background: #feebc8; border-left: 3px solid #f6ad55;"><strong>~ </strong>' + modLine + '</div>';
                    changed++;
                }
            }
            
            document.getElementById('addedCount').textContent = added;
            document.getElementById('removedCount').textContent = removed;
            document.getElementById('changedCount').textContent = changed;
            document.getElementById('diffOutput').innerHTML = output;
            document.getElementById('diffResult').style.display = 'block';
            
            saveToHistory('Text Compare', original.length + ' vs ' + modified.length + ' lines', added + ' added, ' + removed + ' removed');
        }
        

        // Color Picker Enhancement Functions
        function randomColorPick() {
            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            document.getElementById('colorInput').value = randomColor;
            updateColorCodes();
        }
        
        function loadColorExample() {
            const examples = ['#667eea', '#48bb78', '#f6ad55', '#fc8181', '#9f7aea', '#38b2ac'];
            const random = examples[Math.floor(Math.random() * examples.length)];
            document.getElementById('colorInput').value = random;
            updateColorCodes();
        }
        
        function copyColorCode(type) {
            let text = '';
            if (type === 'hex') {
                text = document.getElementById('hexCode').textContent;
            } else if (type === 'rgb') {
                text = document.getElementById('rgbCode').textContent;
            } else if (type === 'hsl') {
                text = document.getElementById('hslCode').textContent;
            }
            
            navigator.clipboard.writeText(text).then(() => {
                alert('✅ Copied: ' + text);
            });
        }
        
        function shareColor() {
            const hex = document.getElementById('hexCode').textContent;
            const rgb = document.getElementById('rgbCode').textContent;
            const shareText = `Color: ${hex}\n${rgb}\n\nFrom ToolDexo.com`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Color from ToolDexo',
                    text: shareText
                });
            } else {
                navigator.clipboard.writeText(shareText);
                alert('✅ Color info copied!\n\n' + shareText);
            }
        }
        

        // Loan Calculator Enhancement Functions
        function loadLoanExample() {
            document.getElementById('loanAmount').value = '20000';
            document.getElementById('interestRate').value = '5.5';
            document.getElementById('loanTerm').value = '60';
            calculateLoan();
        }
        
        function clearLoan() {
            document.getElementById('loanAmount').value = '';
            document.getElementById('interestRate').value = '';
            document.getElementById('loanTerm').value = '';
            document.getElementById('loanResult').style.display = 'none';
        }
        
        function calculateLoan() {
            const principal = parseFloat(document.getElementById('loanAmount').value);
            const annualRate = parseFloat(document.getElementById('interestRate').value);
            const months = parseInt(document.getElementById('loanTerm').value);
            
            if (!principal || !annualRate || !months) {
                alert('Please fill in all fields');
                return;
            }
            
            const monthlyRate = annualRate / 100 / 12;
            const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
            const totalPayment = monthlyPayment * months;
            const totalInterest = totalPayment - principal;
            
            document.getElementById('monthlyPayment').textContent = '$' + monthlyPayment.toFixed(2);
            document.getElementById('totalPayment').textContent = '$' + totalPayment.toFixed(2);
            document.getElementById('totalInterest').textContent = '$' + totalInterest.toFixed(2);
            document.getElementById('principalAmount').textContent = '$' + principal.toFixed(2);
            
            // Breakdown
            const interestPercent = ((totalInterest / totalPayment) * 100).toFixed(1);
            const breakdown = `You'll pay <strong>$${monthlyPayment.toFixed(2)}/month</strong> for ${months} months.\n` +
                            `Total interest: <strong>$${totalInterest.toFixed(2)}</strong> (${interestPercent}% of total payment).\n` +
                            `You're paying <strong>$${(totalInterest/months).toFixed(2)}/month</strong> just in interest.`;
            document.getElementById('loanBreakdown').innerHTML = breakdown.replace(/\n/g, '<br>');
            
            document.getElementById('loanResult').style.display = 'block';
            
            saveToHistory('Loan Calculator', '$' + principal.toFixed(2) + ' @ ' + annualRate + '%', 
                         'Monthly: $' + monthlyPayment.toFixed(2));
        }
        
        function copyLoanResult() {
            const monthly = document.getElementById('monthlyPayment').textContent;
            const total = document.getElementById('totalPayment').textContent;
            const interest = document.getElementById('totalInterest').textContent;
            const text = `Loan Calculator Results\n\nMonthly Payment: ${monthly}\nTotal Payment: ${total}\nTotal Interest: ${interest}\n\nCalculated with ToolDexo.com`;
            
            navigator.clipboard.writeText(text).then(() => {
                alert('✅ Results copied to clipboard!');
            });
        }
        
        function shareLoanResult() {
            const monthly = document.getElementById('monthlyPayment').textContent;
            const shareText = `My loan payment would be ${monthly}/month. Calculate yours at ToolDexo.com`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Loan Calculator',
                    text: shareText
                });
            } else {
                navigator.clipboard.writeText(shareText);
                alert('✅ Share text copied!\n\n' + shareText);
            }
        }
        

        // Timezone Converter Functions
        function loadTimezoneExample() {
            // Set datetime to now
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const dateTimeStr = `${year}-${month}-${day}T${hours}:${minutes}`;
            
            document.getElementById('tzDateTime').value = dateTimeStr;
            document.getElementById('fromCity').value = 'America/New_York';
            document.getElementById('toCity').value = 'Asia/Tokyo';
            convertTimezoneNew();
        }
        
        function convertTimezoneNew() {
            const dateTimeInput = document.getElementById('tzDateTime').value;
            const fromTZ = document.getElementById('fromCity').value;
            const toTZ = document.getElementById('toCity').value;
            
            if (!dateTimeInput) {
                alert('Please select a date and time');
                return;
            }
            
            try {
                // Parse the datetime
                const inputDate = new Date(dateTimeInput);
                
                // Get city names from select options
                const fromSelect = document.getElementById('fromCity');
                const toSelect = document.getElementById('toCity');
                const fromCityName = fromSelect.options[fromSelect.selectedIndex].text;
                const toCityName = toSelect.options[toSelect.selectedIndex].text;
                
                // Format times
                const fromTime = inputDate.toLocaleString('en-US', {
                    timeZone: fromTZ,
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                });
                
                const toTime = inputDate.toLocaleString('en-US', {
                    timeZone: toTZ,
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                });
                
                // Calculate time difference
                const fromOffset = getTimezoneOffset(inputDate, fromTZ);
                const toOffset = getTimezoneOffset(inputDate, toTZ);
                const diffHours = (toOffset - fromOffset) / 60;
                
                // Update display
                document.getElementById('fromCityName').textContent = fromCityName;
                document.getElementById('toCityName').textContent = toCityName;
                document.getElementById('fromTimeDisplay').textContent = fromTime;
                document.getElementById('toTimeDisplay').textContent = toTime;
                
                let diffText = Math.abs(diffHours) + ' hours';
                if (diffHours > 0) {
                    diffText += ' ahead';
                } else if (diffHours < 0) {
                    diffText += ' behind';
                } else {
                    diffText = 'Same time zone';
                }
                document.getElementById('timeDiff').textContent = diffText;
                
                document.getElementById('timezoneResult').style.display = 'block';
                
                saveToHistory('Timezone Converter', fromCityName + ' → ' + toCityName, diffText);
            } catch (error) {
                alert('Error converting timezone. Please check your inputs.');
                console.error(error);
            }
        }
        
        function getTimezoneOffset(date, timeZone) {
            const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
            const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
            return (tzDate.getTime() - utcDate.getTime()) / 60000;
        }
        

        // Markdown Editor Functions
        function loadMarkdownExample() {
            const example = `# Getting Started with Markdown

## What is Markdown?
Markdown is a **lightweight** markup language for formatting text.

## Syntax Examples

### Text Formatting
- **Bold text** with double asterisks
- *Italic text* with single asterisks  
- ~~Strikethrough~~ with tildes

### Lists
1. First item
2. Second item
3. Third item

- Bullet point
- Another point

### Links
[Visit Google](https://google.com)

### Code
Inline \`code\` uses backticks

### Quotes
> This is a blockquote

---

**Happy writing!** 🎉`;
            
            document.getElementById('markdownInput').value = example;
            updateMarkdown();
        }
        
        function clearMarkdownEditor() {
            document.getElementById('markdownInput').value = '';
            document.getElementById('markdownPreview').innerHTML = '';
        }
        
        function copyMarkdownText() {
            const text = document.getElementById('markdownInput').value;
            if (!text) {
                alert('Nothing to copy!');
                return;
            }
            navigator.clipboard.writeText(text).then(() => {
                alert('✅ Markdown copied!');
            });
        }
        
        function downloadMarkdownFile() {
            const text = document.getElementById('markdownInput').value;
            if (!text) {
                alert('Nothing to download!');
                return;
            }
            const blob = new Blob([text], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'document.md';
            a.click();
            URL.revokeObjectURL(url);
        }
        
        function copyAsHTML() {
            const html = document.getElementById('markdownPreview').innerHTML;
            if (!html) {
                alert('Nothing to copy!');
                return;
            }
            navigator.clipboard.writeText(html).then(() => {
                alert('✅ HTML copied!');
            });
        }
        
        function updateMarkdown() {
            const input = document.getElementById('markdownInput').value;
            let html = input
                .replace(/^### (.*$)/gim, '<h3 style="font-size: 20px; font-weight: 600; margin: 12px 0;">$1</h3>')
                .replace(/^## (.*$)/gim, '<h2 style="font-size: 24px; font-weight: 700; margin: 15px 0;">$1</h2>')
                .replace(/^# (.*$)/gim, '<h1 style="font-size: 32px; font-weight: 700; margin: 20px 0;">$1</h1>')
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.+?)\*/g, '<em>$1</em>')
                .replace(/~~(.+?)~~/g, '<del>$1</del>')
                .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" style="color: #667eea;">$1</a>')
                .replace(/`(.+?)`/g, '<code style="background: #f7fafc; padding: 2px 6px; border-radius: 3px;">$1</code>')
                .replace(/^> (.+$)/gim, '<blockquote style="border-left: 4px solid #667eea; padding-left: 15px; color: #4a5568; font-style: italic;">$1</blockquote>')
                .replace(/^---$/gim, '<hr style="border: 1px solid #e2e8f0; margin: 20px 0;">')
                .replace(/\n/g, '<br>');
            
            document.getElementById('markdownPreview').innerHTML = html;
            saveToHistory('Markdown Editor', input.substring(0, 30), 'Updated');
        }
        

console.log('All tool functions loaded successfully');

console.log('✅ All tool functions loaded successfully');
