// ============================================
// TOOLS DATA CONFIGURATION
// ============================================

const TOOLS_CONFIG = [
    { id: 'word-counter', name: '📝 Word Counter', category: 'text' },
    { id: 'case-converter', name: '🔤 Case Converter', category: 'text' },
    { id: 'character-counter', name: '🔢 Char Counter', category: 'text' },
    { id: 'text-diff', name: '🔍 Text Compare', category: 'text' },
    { id: 'markdown-editor', name: '📝 Markdown Editor', category: 'text' },
    
    { id: 'percentage-calc', name: '📊 Percentage Calc', category: 'calc' },
    { id: 'age-calculator', name: '🎂 Age Calculator', category: 'calc' },
    { id: 'bmi-calculator', name: '⚖️ BMI Calculator', category: 'calc' },
    { id: 'tip-calculator', name: '💰 Tip Calculator', category: 'calc' },
    { id: 'loan-calculator', name: '🏦 Loan Calculator', category: 'calc' },
    { id: 'calorie-calculator', name: '🔥 Calorie Calculator', category: 'calc' },
    { id: 'mortgage-calculator', name: '🏠 Mortgage Calc', category: 'calc' },
    { id: 'tax-calculator', name: '💵 Tax Calculator', category: 'calc' },
    { id: 'grade-calculator', name: '🎓 Grade Calculator', category: 'calc' },
    { id: 'date-calculator', name: '📅 Date Calculator', category: 'calc' },
    { id: 'compound-interest', name: '📈 Compound Interest', category: 'calc' },
    { id: 'salary-calculator', name: '💵 Salary Calculator', category: 'calc' },
    { id: 'bodyfat-calculator', name: '💪 Body Fat Calc', category: 'calc' },
    
    { id: 'unit-converter', name: '📏 Unit Converter', category: 'converter' },
    { id: 'currency-converter', name: '💱 Currency Conv', category: 'converter' },
    { id: 'timezone-converter', name: '🌍 Timezone Conv', category: 'converter' },
    { id: 'filesize-converter', name: '💾 File Size Conv', category: 'converter' },
    { id: 'image-resizer', name: '🖼️ Image Resizer', category: 'converter' },
    
    { id: 'password-generator', name: '🔐 Password Gen', category: 'generator' },
    { id: 'qr-generator', name: '📱 QR Generator', category: 'generator' },
    { id: 'color-picker', name: '🎨 Color Picker', category: 'generator' },
    { id: 'lorem-ipsum', name: '📄 Lorem Ipsum', category: 'generator' },
    { id: 'random-number', name: '🎲 Random Number', category: 'generator' },
    { id: 'favicon-generator', name: '🎨 Favicon Generator', category: 'generator' },
    
    { id: 'json-formatter', name: '{ } JSON Formatter', category: 'dev' },
    { id: 'base64-tool', name: '🔐 Base64 Tool', category: 'dev' },
    { id: 'hash-generator', name: '🔐 Hash Generator', category: 'dev' }
];

// Unit conversion data
const UNITS = {
    length: {
        meter: 1,
        kilometer: 0.001,
        centimeter: 100,
        millimeter: 1000,
        mile: 0.000621371,
        yard: 1.09361,
        foot: 3.28084,
        inch: 39.3701
    },
    weight: {
        kilogram: 1,
        gram: 1000,
        milligram: 1000000,
        pound: 2.20462,
        ounce: 35.274,
        ton: 0.001
    },
    temperature: {
        celsius: { toCelsius: c => c, fromCelsius: c => c },
        fahrenheit: { toCelsius: f => (f - 32) * 5/9, fromCelsius: c => (c * 9/5) + 32 },
        kelvin: { toCelsius: k => k - 273.15, fromCelsius: c => c + 273.15 }
    }
};

// Lorem ipsum paragraphs
const LOREM_PARAGRAPHS = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
    "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae."
];

// Currency exchange rates cache
let exchangeRates = {};
let lastFetchTime = 0;
const CACHE_DURATION = 3600000; // 1 hour

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TOOLS_CONFIG, UNITS, LOREM_PARAGRAPHS };
}
