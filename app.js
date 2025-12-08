// ============================================
// APPLICATION INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Populate tool navigation
    populateToolButtons();
    
    // Show first tool by default
    showTool('word-counter');
    
    // Initialize any tools that need setup
    initializeWordCounter();
    initializeCurrencyConverter();
    updateUnitOptions();
    updateColorCodes();
    
    // Set default dates for date-dependent tools
    setDefaultDates();
    
    console.log('ToolDexo initialized successfully!');
}

// ============================================
// NAVIGATION
// ============================================

function populateToolButtons() {
    const container = document.getElementById('toolButtons');
    if (!container) return;
    
    TOOLS_CONFIG.forEach((tool, index) => {
        const btn = document.createElement('button');
        btn.textContent = tool.name;
        btn.className = index === 0 ? 'active' : '';
        btn.onclick = function() { showTool(tool.id, this); };
        btn.dataset.category = tool.category;
        btn.setAttribute('aria-label', `Open ${tool.name}`);
        container.appendChild(btn);
    });
}

function filterTools(category) {
    const buttons = document.querySelectorAll('.tool-nav-buttons button');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    // Update category button active state
    categoryBtns.forEach(btn => {
        btn.classList.remove('active');
        const btnText = btn.textContent.toLowerCase();
        if (btnText.includes(category) || category === 'all') {
            btn.classList.add('active');
        }
    });
    
    // Filter tool buttons
    buttons.forEach(btn => {
        if (category === 'all' || btn.dataset.category === category) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    });
}

function showTool(toolId, buttonElement) {
    // Hide all tool cards
    document.querySelectorAll('.tool-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tool-nav-buttons button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tool
    const toolCard = document.getElementById(toolId);
    if (toolCard) {
        toolCard.classList.add('active');
        toolCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Highlight button
    if (buttonElement) {
        buttonElement.classList.add('active');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function setDefaultDates() {
    const today = new Date();
    const todayString = today.toISOString().slice(0, 10);
    
    // Date calculator
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    if (startDate) startDate.value = todayString;
    if (endDate) {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        endDate.value = nextWeek.toISOString().slice(0, 10);
    }
    
    // Timezone converter
    const tzDateTime = document.getElementById('tzDateTime');
    if (tzDateTime) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        tzDateTime.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
}

function saveToHistory(toolName, input, result) {
    // Placeholder for history functionality
    console.log(`History: ${toolName} - ${input} = ${result}`);
}

function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button ? button.textContent : '';
        if (button) {
            button.textContent = '✅ Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        } else {
            alert('✅ Copied to clipboard!');
        }
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('❌ Failed to copy to clipboard');
    });
}

function shareResult(title, result) {
    const shareText = `${title}: ${result}\n\nCalculated with ToolDexo.com`;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: shareText
        }).catch(err => console.log('Error sharing:', err));
    } else {
        copyToClipboard(shareText);
        alert('✅ Share text copied to clipboard!');
    }
}

// ============================================
// INITIALIZATION FUNCTIONS
// ============================================

function initializeWordCounter() {
    const textarea = document.getElementById('wordCountText');
    if (textarea) {
        textarea.addEventListener('input', updateWordCount);
    }
}

function initializeCurrencyConverter() {
    // Fetch exchange rates on initialization
    fetchExchangeRates();
}

console.log('App.js loaded successfully');
