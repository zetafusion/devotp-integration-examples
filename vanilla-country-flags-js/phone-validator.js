// Function to create flag HTML using CSS
function createFlagElement(countryCode) {
    const flagMap = {
        // North America
        'US': '🇺🇸', 'MX': '🇲🇽', 'BS': '🇧🇸', 'BB': '🇧🇧', 'VG': '🇻🇬', 'KY': '🇰🇾',
        'CR': '🇨🇷', 'DM': '🇩🇲', 'DO': '🇩🇴', 'SV': '🇸🇻', 'GD': '🇬🇩', 'GT': '🇬🇹',
        'HT': '🇭🇹', 'HN': '🇭🇳', 'JM': '🇯🇲', 'MS': '🇲🇸', 'NI': '🇳🇮', 'PA': '🇵🇦',
        'PR': '🇵🇷', 'KN': '🇰🇳', 'LC': '🇱🇨', 'VC': '🇻🇨', 'TT': '🇹🇹', 'TC': '🇹🇨',
        
        // Asia
        'AF': '🇦🇫', 'AM': '🇦🇲', 'AZ': '🇦🇿', 'BH': '🇧🇭', 'BD': '🇧🇩', 'BT': '🇧🇹',
        'BN': '🇧🇳', 'KH': '🇰🇭', 'CN': '🇨🇳', 'KP': '🇰🇵', 'IN': '🇮🇳', 'ID': '🇮🇩',
        'IR': '🇮🇷', 'IQ': '🇮🇶', 'IL': '🇮🇱', 'JP': '🇯🇵', 'JO': '🇯🇴', 'KZ': '🇰🇿',
        'KW': '🇰🇼', 'KG': '🇰🇬', 'LA': '🇱🇦', 'LB': '🇱🇧', 'MY': '🇲🇾', 'MV': '🇲🇻',
        'MN': '🇲🇳', 'MM': '🇲🇲', 'NP': '🇳🇵', 'OM': '🇴🇲', 'PK': '🇵🇰', 'PS': '🇵🇸',
        'PH': '🇵🇭', 'QA': '🇶🇦', 'SA': '🇸🇦', 'SG': '🇸🇬', 'KR': '🇰🇷', 'LK': '🇱🇰',
        'SY': '🇸🇾', 'TJ': '🇹🇯', 'TH': '🇹🇭', 'TL': '🇹🇱', 'TR': '🇹🇷', 'TM': '🇹🇲',
        'AE': '🇦🇪', 'UZ': '🇺🇿', 'VN': '🇻🇳', 'YE': '🇾🇪',
        
        // Europe
        'AL': '🇦🇱', 'AD': '🇦🇩', 'AT': '🇦🇹', 'BY': '🇧🇾', 'BE': '🇧🇪', 'BA': '🇧🇦',
        'BG': '🇧🇬', 'HR': '🇭🇷', 'CZ': '🇨🇿', 'DK': '🇩🇰', 'EE': '🇪🇪', 'FO': '🇫🇴',
        'FI': '🇫🇮', 'FR': '🇫🇷', 'GE': '🇬🇪', 'DE': '🇩🇪', 'GI': '🇬🇮', 'GR': '🇬🇷',
        'HU': '🇭🇺', 'IS': '🇮🇸', 'IE': '🇮🇪', 'IT': '🇮🇹', 'LV': '🇱🇻', 'LI': '🇱🇮',
        'LT': '🇱🇹', 'LU': '🇱🇺', 'MK': '🇲🇰', 'MT': '🇲🇹', 'MD': '🇲🇩', 'MC': '🇲🇨',
        'ME': '🇲🇪', 'NL': '🇳🇱', 'NO': '🇳🇴', 'PL': '🇵🇱', 'PT': '🇵🇹', 'RO': '🇷🇴',
        'RU': '🇷🇺', 'SM': '🇸🇲', 'RS': '🇷🇸', 'SK': '🇸🇰', 'SI': '🇸🇮', 'ES': '🇪🇸',
        'SE': '🇸🇪', 'CH': '🇨🇭', 'GB': '🇬🇧', 'UA': '🇺🇦', 'VA': '🇻🇦',
        
        // South America
        'AR': '🇦🇷', 'BO': '🇧🇴', 'BR': '🇧🇷', 'CL': '🇨🇱', 'CO': '🇨🇴', 'EC': '🇪🇨',
        'GF': '🇬🇫', 'GY': '🇬🇾', 'PY': '🇵🇾', 'PE': '🇵🇪', 'SR': '🇸🇷', 'UY': '🇺🇾', 'VE': '🇻🇪',
        
        // Africa
        'DZ': '🇩🇿', 'AO': '🇦🇴', 'BJ': '🇧🇯', 'BW': '🇧🇼', 'BF': '🇧🇫', 'BI': '🇧🇮',
        'CM': '🇨🇲', 'CV': '🇨🇻', 'CF': '🇨🇫', 'TD': '🇹🇩', 'KM': '🇰🇲', 'CG': '🇨🇬',
        'CD': '🇨🇩', 'DJ': '🇩🇯', 'EG': '🇪🇬', 'GQ': '🇬🇶', 'ER': '🇪🇷', 'ET': '🇪🇹',
        'GA': '🇬🇦', 'GM': '🇬🇲', 'GH': '🇬🇭', 'GN': '🇬🇳', 'GW': '🇬🇼', 'CI': '🇨🇮',
        'KE': '🇰🇪', 'LS': '🇱🇸', 'LR': '🇱🇷', 'LY': '🇱🇾', 'MG': '🇲🇬', 'MW': '🇲🇼',
        'ML': '🇲🇱', 'MR': '🇲🇷', 'MU': '🇲🇺', 'YT': '🇾🇹', 'MA': '🇲🇦', 'MZ': '🇲🇿',
        'NA': '🇳🇦', 'NE': '🇳🇪', 'NG': '🇳🇬', 'RW': '🇷🇼', 'ST': '🇸🇹', 'SN': '🇸🇳',
        'SC': '🇸🇨', 'SL': '🇸🇱', 'SO': '🇸🇴', 'ZA': '🇿🇦', 'SS': '🇸🇸', 'SD': '🇸🇩',
        'SZ': '🇸🇿', 'TZ': '🇹🇿', 'TG': '🇹🇬', 'TN': '🇹🇳', 'UG': '🇺🇬', 'ZM': '🇿🇲', 'ZW': '🇿🇼',
        
        // Oceania
        'AU': '🇦🇺', 'FJ': '🇫🇯', 'PF': '🇵🇫', 'GU': '🇬🇺', 'MH': '🇲🇭', 'FM': '🇫🇲',
        'NC': '🇳🇨', 'NZ': '🇳🇿', 'NF': '🇳🇫', 'PW': '🇵🇼', 'PG': '🇵🇬', 'WS': '🇼🇸',
        'SB': '🇸🇧', 'TO': '🇹🇴', 'TV': '🇹🇻', 'VU': '🇻🇺'
    };

    // Return the emoji flag or fall back to country code
    return flagMap[countryCode] || countryCode;
}

// Country code to flag and name mapping
const countryData = {
    '+1': { flag: 'US', name: 'United States', codes: ['+1'] },
    '+52': { flag: 'MX', name: 'Mexico', codes: ['+52'] },
    '+91': { flag: 'IN', name: 'India', codes: ['+91'] },
    '+81': { flag: 'JP', name: 'Japan', codes: ['+81'] },
    '+90': { flag: 'TR', name: 'Turkey', codes: ['+90'] },
    '+44': { flag: 'GB', name: 'United Kingdom', codes: ['+44'] },
    '+49': { flag: 'DE', name: 'Germany', codes: ['+49'] },
    '+33': { flag: 'FR', name: 'France', codes: ['+33'] },
    '+86': { flag: 'CN', name: 'China', codes: ['+86'] },
    '+7': { flag: 'RU', name: 'Russia', codes: ['+7'] },
    '+55': { flag: 'BR', name: 'Brazil', codes: ['+55'] },
    '+61': { flag: 'AU', name: 'Australia', codes: ['+61'] },
    '+39': { flag: 'IT', name: 'Italy', codes: ['+39'] },
    '+34': { flag: 'ES', name: 'Spain', codes: ['+34'] },
    '+31': { flag: 'NL', name: 'Netherlands', codes: ['+31'] },
    '+46': { flag: 'SE', name: 'Sweden', codes: ['+46'] },
    '+47': { flag: 'NO', name: 'Norway', codes: ['+47'] },
    '+45': { flag: 'DK', name: 'Denmark', codes: ['+45'] },
    '+358': { flag: 'FI', name: 'Finland', codes: ['+358'] },
    '+41': { flag: 'CH', name: 'Switzerland', codes: ['+41'] },
    '+43': { flag: 'AT', name: 'Austria', codes: ['+43'] },
    '+32': { flag: 'BE', name: 'Belgium', codes: ['+32'] },
    '+351': { flag: 'PT', name: 'Portugal', codes: ['+351'] },
    '+30': { flag: 'GR', name: 'Greece', codes: ['+30'] },
    '+48': { flag: 'PL', name: 'Poland', codes: ['+48'] },
    '+420': { flag: 'CZ', name: 'Czech Republic', codes: ['+420'] },
    '+36': { flag: 'HU', name: 'Hungary', codes: ['+36'] },
    '+40': { flag: 'RO', name: 'Romania', codes: ['+40'] },
    '+359': { flag: 'BG', name: 'Bulgaria', codes: ['+359'] },
    '+385': { flag: 'HR', name: 'Croatia', codes: ['+385'] },
    '+381': { flag: 'RS', name: 'Serbia', codes: ['+381'] },
    '+386': { flag: 'SI', name: 'Slovenia', codes: ['+386'] },
    '+421': { flag: 'SK', name: 'Slovakia', codes: ['+421'] },
    '+372': { flag: 'EE', name: 'Estonia', codes: ['+372'] },
    '+371': { flag: 'LV', name: 'Latvia', codes: ['+371'] },
    '+370': { flag: 'LT', name: 'Lithuania', codes: ['+370'] },
    '+353': { flag: 'IE', name: 'Ireland', codes: ['+353'] },
    '+354': { flag: 'IS', name: 'Iceland', codes: ['+354'] },
    '+377': { flag: 'MC', name: 'Monaco', codes: ['+377'] },
    '+376': { flag: 'AD', name: 'Andorra', codes: ['+376'] },
    '+378': { flag: 'SM', name: 'San Marino', codes: ['+378'] },
    '+379': { flag: 'VA', name: 'Vatican City', codes: ['+379'] },
    '+380': { flag: 'UA', name: 'Ukraine', codes: ['+380'] },
    '+375': { flag: 'BY', name: 'Belarus', codes: ['+375'] },
    '+373': { flag: 'MD', name: 'Moldova', codes: ['+373'] },
    '+382': { flag: 'ME', name: 'Montenegro', codes: ['+382'] },
    '+389': { flag: 'MK', name: 'North Macedonia', codes: ['+389'] },
    '+355': { flag: 'AL', name: 'Albania', codes: ['+355'] },
    '+387': { flag: 'BA', name: 'Bosnia and Herzegovina', codes: ['+387'] },
    '+995': { flag: 'GE', name: 'Georgia', codes: ['+995'] },
    // Add more countries as needed...
};

// Function to detect country from phone number
function detectCountry(phoneNumber) {
    if (!phoneNumber.startsWith('+')) {
        return null;
    }
    
    // Sort codes by length (longest first) to match most specific codes first
    const sortedCodes = Object.keys(countryData).sort((a, b) => b.length - a.length);
    
    for (const code of sortedCodes) {
        if (phoneNumber.startsWith(code)) {
            return countryData[code];
        }
    }
    
    return null;
}

// Function to validate phone number format
function validatePhoneNumber(value) {
    // Allow only + at the beginning and numbers
    const validPattern = /^\+?[0-9]*$/;
    return validPattern.test(value);
}

// Function to sanitize input (remove invalid characters)
function sanitizePhoneInput(value) {
    // If it starts with +, keep the + and only numbers after it
    if (value.startsWith('+')) {
        return '+' + value.slice(1).replace(/[^0-9]/g, '');
    } else if (value.length > 0 && !value.startsWith('+')) {
        // If user starts typing without +, add it
        return '+' + value.replace(/[^0-9]/g, '');
    }
    return value.replace(/[^0-9+]/g, '');
}

// Function to show status message
function showStatus(message, isError = false) {
    const statusDiv = document.getElementById('status');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = isError ? 'status-error' : 'status-success';
        statusDiv.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }
}

// Main phone input handler
function initPhoneValidator() {
    const phoneInput = document.getElementById('phoneInput');
    const flagContainer = document.getElementById('flagContainer');
    const countryInfo = document.getElementById('countryInfo');
    const inputContainer = phoneInput?.closest('.input-container');
    
    if (!phoneInput || !flagContainer) {
        console.error('Phone input or flag container not found');
        return;
    }
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value;
        
        // Sanitize input
        const sanitizedValue = sanitizePhoneInput(value);
        
        // If the sanitized value is different, update the input
        if (sanitizedValue !== value) {
            e.target.value = sanitizedValue;
            value = sanitizedValue;
        }
        
        // Clear previous flag and country info
        flagContainer.innerHTML = '';
        if (countryInfo) {
            countryInfo.style.display = 'none';
        }
        
        // Remove validation classes
        if (inputContainer) {
            inputContainer.classList.remove('valid', 'invalid');
        }
        
        // Detect country if we have a valid start
        if (value.length > 1) {
            const country = detectCountry(value);
            if (country) {
                // Use createFlagElement to get the emoji flag
                const flagEmoji = createFlagElement(country.flag);
                flagContainer.innerHTML = `<span>${flagEmoji}</span>`;
                
                if (countryInfo) {
                    countryInfo.innerHTML = `<strong>${country.name}</strong> (${country.codes.join(', ')})`;
                    countryInfo.style.display = 'block';
                }
                
                // Validate the number format
                if (validatePhoneNumber(value)) {
                    if (inputContainer) inputContainer.classList.add('valid');
                } else {
                    if (inputContainer) inputContainer.classList.add('invalid');
                }
            } else if (value.length > 4) {
                // If no country found and we have enough digits, show error
                if (inputContainer) inputContainer.classList.add('invalid');
                showStatus('Invalid country code', true);
            }
        }
    });
    
    // Prevent paste of invalid characters
    phoneInput.addEventListener('paste', function(e) {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        const sanitizedText = sanitizePhoneInput(pastedText);
        e.target.value = sanitizedText;
        
        // Trigger input event to update flag
        e.target.dispatchEvent(new Event('input'));
    });
    
    // Prevent invalid key presses
    phoneInput.addEventListener('keydown', function(e) {
        // Allow: backspace, delete, tab, escape, enter
        if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        
        // Allow + only at the beginning
        if (e.key === '+' && e.target.selectionStart === 0 && !e.target.value.includes('+')) {
            return;
        }
        
        // Allow numbers
        if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
            return;
        }
        
        // Prevent all other keys
        e.preventDefault();
    });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhoneValidator);
} else {
    initPhoneValidator();
}