document.addEventListener('DOMContentLoaded', () => {
    // Default search engine
    let currentEngine = 'duckduckgo';
    const selectedEngineText = document.getElementById('engineName');
    const engineOptions = document.querySelectorAll('.engine-option');
    const engineDropdownModal = document.getElementById('engineDropdownModal');
    
    // Set initial engine name
    selectedEngineText.textContent = 'DuckDuckGo';

    // Explicitly set the dropdown modal to be hidden by default
    engineDropdownModal.style.display = 'none';

    // Handle engine selection
    engineOptions.forEach(option => {
        option.addEventListener('click', () => {
            currentEngine = option.dataset.engine;
            selectedEngineText.textContent = option.textContent;
            
            // Close the dropdown modal
            engineDropdownModal.style.display = 'none';
        });
    });

    // Clock functionality
    function updateClock() {
        const clockElement = document.getElementById('clock');
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit', hour12: false});
    }
    
    // Update clock immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // Prevent browser from saving search input
    searchInput.setAttribute('autocomplete', 'off');
    searchInput.setAttribute('autocomplete', 'chrome-off');

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (!query) return; // Do nothing if query is empty

        // Special handling for specific queries
        if (query === 'game') {
            window.open('https://mellekoster.nl/wishulp/breuken/', '_blank');
            searchInput.value = '';
            return;
        }

        if (query === 'melle') {
            window.open('https://mellekoster.nl', '_blank');
            searchInput.value = '';
            return;
        }

        let searchUrl;
        try {
            // Check if it's a valid URL
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            const isValidUrl = urlPattern.test(query);

            if (isValidUrl && !query.startsWith('http://') && !query.startsWith('https://')) {
                // If it's a valid URL without protocol, add https
                searchUrl = `https://${query}`;
                window.open(searchUrl, '_blank');
            } else if (isValidUrl) {
                // If it's a full URL, open it directly
                window.open(query, '_blank');
            } else {
                // Perform search based on selected search engine
                switch(currentEngine) {
                    case 'google':
                        searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                        break;
                    case 'duckduckgo':
                        searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
                        break;
                    case 'bing':
                        searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
                        break;
                    case 'yahoo':
                        searchUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`;
                        break;
                    case 'ecosia':
                        searchUrl = `https://www.ecosia.org/search?q=${encodeURIComponent(query)}`;
                        break;
                    case 'brave':
                        searchUrl = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
                        break;
                    case 'yandex':
                        searchUrl = `https://yandex.com/search/?text=${encodeURIComponent(query)}`;
                        break;
                    case 'startpage':
                        searchUrl = `https://www.startpage.com/do/search?q=${encodeURIComponent(query)}`;
                        break;
                    case 'wikipedia':
                        searchUrl = `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`;
                        break;
                    case 'crazygames':
                        searchUrl = `https://www.crazygames.com/search?q=${encodeURIComponent(query)}`;
                        break;
                    default:
                        searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
                }
                window.open(searchUrl, '_blank');
            }

            // Clear input after search
            searchInput.value = '';
        } catch (error) {
            console.error('Search error:', error);
            alert('Unable to perform search. Please try again.');
        }
    }

    // Add event listeners for search
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Add click event to show engine dropdown
    const selectedEngine = document.getElementById('selectedEngine');
    selectedEngine.addEventListener('click', () => {
        // Toggle the dropdown modal
        engineDropdownModal.style.display = engineDropdownModal.style.display === 'flex' ? 'none' : 'flex';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (engineDropdownModal.style.display === 'flex' && 
            !engineDropdownModal.contains(e.target) && 
            !selectedEngine.contains(e.target)) {
            engineDropdownModal.style.display = 'none';
        }
    });
});
