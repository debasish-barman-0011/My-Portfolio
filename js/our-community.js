const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRwZTAjm116FjWr4M81cuiRyYIqaFs7BpNa0I35ey_HMMzTim4bWX1W3Oj2Mf0d8kUicmNJl81YQGlu/pub?gid=2136762083&single=true&output=csv';

let allUsers = [];

// Initialize Users//
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    document.getElementById('refreshBtn').addEventListener('click', loadUserData);
    document.getElementById('searchInput').addEventListener('input', filterUsers);
});

// FIXED CSV PARSER - Handles commas within cells //
function parseCSV(csvText) {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let insideQuotes = false;
    
    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];
        
        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                // Double quote inside quoted cell //
                currentCell += '"';
                i++; // Skip next character //
            } else {
                // Single quote - toggle mode //
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            // End of cell //
            currentRow.push(currentCell);
            currentCell = '';
        } else if (char === '\n' && !insideQuotes) {
            // End of row //
            currentRow.push(currentCell);
            rows.push(currentRow);
            currentRow = [];
            currentCell = '';
        } else if (char === '\r' && nextChar === '\n' && !insideQuotes) {
            // Handle Windows line endings //
            currentRow.push(currentCell);
            rows.push(currentRow);
            currentRow = [];
            currentCell = '';
            i++; // Skip the \n
        } else {
            currentCell += char;
        }
    }
    
    // Add last row if exists //
    if (currentCell !== '' || currentRow.length > 0) {
        currentRow.push(currentCell);
        rows.push(currentRow);
    }
    
    return rows;
}

async function loadUserData() {
    showLoading();
    
    try {
        const response = await fetch(GOOGLE_SHEETS_CSV_URL);
        
        if (response.ok) {
            const csvText = await response.text();
            console.log('Raw CSV:', csvText.substring(0, 500));
            
            const rows = parseCSV(csvText);
            console.log('Parsed rows:', rows);
            
            if (rows.length < 2) {
                throw new Error('No data found in CSV');
            }
            
            // Get headers (first row) //
            const headers = rows[0].map(h => h.trim());
            console.log('Headers:', headers);
            
            // Process data rows //
            allUsers = [];
            const cities = new Set();
            
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const user = {};
                
                headers.forEach((header, index) => {
                    user[header] = row[index] ? row[index].trim() : '';
                });
                
                // Validate required fields //
                if (user.Name && user.Name.trim() !== '') {
                    allUsers.push(user);
                    if (user['Home Town/City']) {
                        cities.add(user['Home Town/City']);
                    }
                }
            }
            
            console.log('Processed users:', allUsers);
            displayUsers(allUsers);
            updateStats(allUsers.length, cities.size);
            
        } else {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('userGrid').innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error: ${error.message}</p>
                <p>Check console for details (F12)</p>
            </div>
        `;
    }
}

// Social link processor //
function processSocialLink(value, platform) {
    if (!value || value.trim() === '') return null;
    
    const val = value.trim();
    
    // DEBUG //
    console.log(`Processing ${platform}: "${val}"`);
    
    // Already a full URL //
    if (val.startsWith('http://') || val.startsWith('https://')) {
        return val;
    }
    
    // Missing protocol but has domain //
    if (val.includes('.com') || val.includes('.in') || val.includes('.org')) {
        return 'https://' + val;
    }
    
    // Platform-specific processing //
    switch(platform) {
        case 'instagram':
            // Remove @ if present //
            const igUser = val.replace('@', '');
            return `https://instagram.com/${igUser}`;
            
        case 'facebook':
            // Check if numeric ID //
            if (/^\d+$/.test(val)) {
                return `https://facebook.com/profile.php?id=${val}`;
            }
            return `https://facebook.com/${val}`;
            
        case 'linkedin':
            // Check if already in format //
            if (val.includes('/in/')) {
                if (val.startsWith('/in/')) {
                    return `https://linkedin.com${val}`;
                }
                return `https://linkedin.com/${val}`;
            }
            return `https://linkedin.com/in/${val}`;
            
        default:
            return val;
    }
}

// Process other profiles //
function processOtherProfile(value) {
    if (!value || value.trim() === '') return null;
    
    const val = value.trim();
    let url = val;
    let icon = 'fas fa-globe';
    let name = 'Profile';
    
    // Ensure URL has protocol //
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    
    // Detect platform for icon //
    if (val.includes('github.com')) {
        icon = 'fab fa-github';
        name = 'GitHub';
    } else if (val.includes('youtube.com') || val.includes('youtu.be')) {
        icon = 'fab fa-youtube';
        name = 'YouTube';
    } else if (val.includes('telegram.me') || val.includes('t.me')) {
        icon = 'fab fa-telegram';
        name = 'Telegram';
    } else if (val.includes('twitter.com') || val.includes('x.com')) {
        icon = 'fab fa-twitter';
        name = 'Twitter';
    }
    
    return { url, icon, name };
}

// Create user card //
function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'user-card';
    
    // Process social links //
    const instagram = user['Insagram Username/Link'] || '';
    const facebook = user['Facebook Username/Link'] || '';
    const linkedin = user['Linkedin Username/Link'] || '';
    const other = user['Other Profile If any (YouTube, Telegram etc)'] || '';
    
    const instagramLink = processSocialLink(instagram, 'instagram');
    const facebookLink = processSocialLink(facebook, 'facebook');
    const linkedinLink = processSocialLink(linkedin, 'linkedin');
    const otherProfile = processOtherProfile(other);
    
    card.innerHTML = `
        <h3 class="user-name">${user.Name || 'Unknown'}</h3>
        <div class="user-city">
            <i class="fas fa-map-marker-alt"></i>
            ${user['Home Town/City'] || 'Not specified'}
        </div>
        
        <div class="social-section">
            <div class="social-label">Connect</div>
            <div class="social-icons">
                ${instagramLink ? `
                <a href="${instagramLink}" target="_blank" class="social-link instagram">
                    <i class="fab fa-instagram"></i>
                    <span class="social-tooltip">Instagram</span>
                </a>` : ''}
                
                ${facebookLink ? `
                <a href="${facebookLink}" target="_blank" class="social-link facebook">
                    <i class="fab fa-facebook-f"></i>
                    <span class="social-tooltip">Facebook</span>
                </a>` : ''}
                
                ${linkedinLink ? `
                <a href="${linkedinLink}" target="_blank" class="social-link linkedin">
                    <i class="fab fa-linkedin-in"></i>
                    <span class="social-tooltip">LinkedIn</span>
                </a>` : ''}
                
                ${otherProfile ? `
                <a href="${otherProfile.url}" target="_blank" class="social-link other">
                    <i class="${otherProfile.icon}"></i>
                    <span class="social-tooltip">${otherProfile.name}</span>
                </a>` : ''}
            </div>
        </div>
        
        <!-- Debug info -- 
        <div style="margin-top: 15px; font-size: 0.7rem; color: #666; border-top: 1px dashed #333; padding-top: 8px;">
            <div><strong>Raw Data:</strong></div>
            <div>Instagram: ${instagram}</div>
            <div>Facebook: ${facebook}</div>
            <div>LinkedIn: ${linkedin}</div>
            <div>Other: ${other}</div>
        </div>
        
        -->
        <!-- End Debug info -->
    `;
    
    return card;
}

// Display users //
function displayUsers(users) {
    const grid = document.getElementById('userGrid');
    
    if (!users || users.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-user-slash"></i>
                <p>No users found</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = '';
    users.forEach(user => {
        grid.appendChild(createUserCard(user));
    });
}

// Update stats //
function updateStats(userCount, cityCount) {
    document.getElementById('totalUsers').textContent = userCount;
    document.getElementById('citiesCount').textContent = cityCount;
    
    // Calculate social profiles //
    let socialCount = 0;
    allUsers.forEach(user => {
        if (user['Insagram Username/Link']) socialCount++;
        if (user['Facebook Username/Link']) socialCount++;
        if (user['Linkedin Username/Link']) socialCount++;
        if (user['Other Profile If any (YouTube, Telegram etc)']) socialCount++;
    });
    
    document.getElementById('socialCount').textContent = socialCount;
}

// Show loading //
function showLoading() {
    document.getElementById('userGrid').innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
}

// Filter users //
function filterUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        displayUsers(allUsers);
        return;
    }
    
    const filtered = allUsers.filter(user => {
        const nameMatch = user.Name.toLowerCase().includes(searchTerm);
        const cityMatch = user['Home Town/City'] && 
                         user['Home Town/City'].toLowerCase().includes(searchTerm);
        return nameMatch || cityMatch;
    });
    
    displayUsers(filtered);
}
