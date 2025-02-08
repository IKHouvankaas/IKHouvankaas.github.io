document.addEventListener('DOMContentLoaded', () => {
    // New function to get user's IP address
    async function getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Failed to fetch IP:', error);
            return 'unknown_ip';
        }
    }

    // Modify save settings to save with IP address
    async function saveBackgroundForUser(backgroundUrlToSave) {
        try {
            const userIP = await getUserIP();
            
            // Retrieve existing backgrounds
            const savedBackgrounds = JSON.parse(localStorage.getItem('foam_backgrounds') || '{}');
            
            // Save background for this IP
            savedBackgrounds[userIP] = {
                backgroundUrl: backgroundUrlToSave,
                timestamp: Date.now()
            };
            
            // Save back to localStorage
            localStorage.setItem('foam_backgrounds', JSON.stringify(savedBackgrounds));
            
            // Apply background immediately
            document.body.style.backgroundImage = `url('${backgroundUrlToSave}')`;
            
            return true;
        } catch (error) {
            console.error('Error saving background:', error);
            return false;
        }
    }

    // New function to get a unique identifier for the user
    function getUserIdentifier() {
        // Try to get a stored identifier first
        let userId = localStorage.getItem('foam_user_id');
        
        if (!userId) {
            // Generate a new identifier if not exists
            userId = generateUniqueId();
            localStorage.setItem('foam_user_id', userId);
        }
        
        return userId;
    }

    // Function to generate a unique identifier
    function generateUniqueId() {
        return 'foam_' + Math.random().toString(36).substr(2, 9);
    }

    // Get DOM elements (consolidate element selections)
    const elements = {
        searchInput: document.getElementById('searchInput'),
        searchButton: document.getElementById('searchButton'),
        selectedEngineText: document.getElementById('engineName'),
        engineOptions: document.querySelectorAll('.engine-option'),
        engineDropdownModal: document.getElementById('engineDropdownModal'),
        clock: document.getElementById('clock'),
        settingsButton: document.getElementById('settingsButton'),
        settingsMenu: document.getElementById('settingsMenu'),
        closeSettingsButton: document.getElementById('closeSettingsButton'),
        saveSettingsButton: document.getElementById('saveSettingsButton'),
        backgroundUrlInput: document.getElementById('backgroundUrlInput'),
        loginUsername: document.getElementById('loginUsername'),
        loginPassword: document.getElementById('loginPassword'),
        loginButton: document.getElementById('loginButton'),
        loginMessage: document.getElementById('loginMessage'),
        wallpaperOptions: document.querySelectorAll('.wallpaper-option'),
        uploadArea: document.getElementById('uploadArea'),
        dragDropZone: document.getElementById('dragDropZone'),
        fileUpload: document.getElementById('fileUpload'),
        contextMenu: document.getElementById('contextMenu'),
        giveFeedbackItem: document.getElementById('giveFeedback'),
        selectedEngine: document.getElementById('selectedEngine'),
        defaultWallpapers: document.getElementById('defaultWallpapers'),
        settingsSidebarItems: document.querySelectorAll('.settings-sidebar-item'),
        settingsSections: document.querySelectorAll('.settings-section')
    };

    // Default search engine
    let currentEngine = 'duckduckgo';
    elements.selectedEngineText.textContent = 'DuckDuckGo';

    // Explicitly set the dropdown modal to be hidden by default
    elements.engineDropdownModal.style.display = 'none';

    // Handle engine selection
    elements.engineOptions.forEach(option => {
        option.addEventListener('click', () => {
            currentEngine = option.dataset.engine;
            elements.selectedEngineText.textContent = option.textContent;
            
            // Close the dropdown modal
            elements.engineDropdownModal.style.display = 'none';
        });
    });

    // Clock functionality
    function updateClock() {
        const now = new Date();
        elements.clock.textContent = now.toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit', hour12: false});
    }
    
    // Update clock immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);

    // Search functionality

    // Prevent browser from saving search input
    elements.searchInput.setAttribute('autocomplete', 'off');
    elements.searchInput.setAttribute('autocomplete', 'chrome-off');

    function performSearch() {
        const query = elements.searchInput.value.trim().toLowerCase();
        
        if (!query) return; // Do nothing if query is empty

        // Special handling for specific queries
        if (query === 'game') {
            window.open('https://mellekoster.nl/wishulp/breuken/', '_blank');
            window.close();
            return;
        }

        if (query === 'melle') {
            window.open('https://mellekoster.nl', '_blank');
            window.close();
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
                window.close();
            } else if (isValidUrl) {
                // If it's a full URL, open it directly
                window.open(query, '_blank');
                window.close();
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
                    case 'github':
                        searchUrl = `https://github.com/search?q=${encodeURIComponent(query)}`;
                        break;
                    default:
                        searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
                }
                window.open(searchUrl, '_blank');
                window.close();
            }

            // Clear input after search
            elements.searchInput.value = '';
        } catch (error) {
            console.error('Search error:', error);
            alert('Unable to perform search. Please try again.');
        }
    }

    // Add event listeners for search
    elements.searchButton.addEventListener('click', performSearch);
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Add click event to show engine dropdown
    elements.selectedEngine.addEventListener('click', () => {
        // Toggle the dropdown modal
        elements.engineDropdownModal.style.display = elements.engineDropdownModal.style.display === 'flex' ? 'none' : 'flex';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (elements.engineDropdownModal.style.display === 'flex' && 
            !elements.engineDropdownModal.contains(e.target) && 
            !elements.selectedEngine.contains(e.target)) {
            elements.engineDropdownModal.style.display = 'none';
        }
    });

    // Settings menu functionality

    // Settings sidebar functionality
    elements.settingsSidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items and sections
            elements.settingsSidebarItems.forEach(i => i.classList.remove('active'));
            elements.settingsSections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked item and corresponding section
            item.classList.add('active');
            const sectionToShow = document.querySelector(`.settings-section.${item.dataset.section}`);
            sectionToShow.classList.add('active');
        });
    });

    // Login functionality

    // Prevent disabled fields from being focused
    elements.backgroundUrlInput.addEventListener('click', (e) => {
        if (elements.backgroundUrlInput.disabled) {
            e.preventDefault();
        }
    });
    elements.saveSettingsButton.addEventListener('click', (e) => {
        if (elements.saveSettingsButton.disabled) {
            e.preventDefault();
        }
    });

    // Store users in localStorage
    const users = JSON.parse(localStorage.getItem('foam_users') || '{}');

    elements.loginButton.addEventListener('click', () => {
        const username = elements.loginUsername.value.trim();
        const password = elements.loginPassword.value.trim();

        if (!username || !password) {
            elements.loginMessage.textContent = 'Please enter both username and password';
            return;
        }

        if (username.includes(' ')) {
            elements.loginMessage.textContent = 'Username cannot contain spaces';
            return;
        }

        const users = JSON.parse(localStorage.getItem('foam_users') || '{}');

        if (users[username]) {
            // Existing user
            if (users[username].password === password) {
                // Successful login
                localStorage.setItem('currentUser', username);
                elements.loginMessage.textContent = 'Login successful!';
                elements.loginMessage.style.color = 'green';

                // Enable settings
                elements.backgroundUrlInput.disabled = false;
                elements.saveSettingsButton.disabled = false;

                // Switch to wallpaper settings tab
                elements.settingsSidebarItems.forEach(i => i.classList.remove('active'));
                elements.settingsSections.forEach(s => s.classList.remove('active'));
                document.querySelector('.settings-sidebar-item[data-section="wallpaper"]').classList.add('active');
                document.querySelector('.settings-section.wallpaper').classList.add('active');
            } else {
                elements.loginMessage.textContent = 'Incorrect password';
            }
        } else {
            // New user
            users[username] = {
                password: password,
                settings: {}
            };
            localStorage.setItem('foam_users', JSON.stringify(users));
            localStorage.setItem('currentUser', username);
            
            elements.loginMessage.textContent = 'Account created successfully!';
            elements.loginMessage.style.color = 'green';

            // Enable settings
            elements.backgroundUrlInput.disabled = false;
            elements.saveSettingsButton.disabled = false;

            // Switch to wallpaper settings tab
            elements.settingsSidebarItems.forEach(i => i.classList.remove('active'));
            elements.settingsSections.forEach(s => s.classList.remove('active'));
            document.querySelector('.settings-sidebar-item[data-section="wallpaper"]').classList.add('active');
            document.querySelector('.settings-section.wallpaper').classList.add('active');
        }
    });

    // Wallpaper selection functionality

    elements.wallpaperOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            elements.wallpaperOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Update background URL input
            elements.backgroundUrlInput.value = option.dataset.url;

            // Enable save button to encourage explicit save
            elements.saveSettingsButton.disabled = false;
        });
    });

    // Add image preview functionality
    const imagePreview = document.createElement('img');
    imagePreview.classList.add('image-preview');
    elements.backgroundUrlInput.parentNode.insertBefore(imagePreview, elements.backgroundUrlInput.nextSibling);

    // Validate and preview URL
    elements.backgroundUrlInput.addEventListener('input', () => {
        const url = elements.backgroundUrlInput.value.trim();
        
        // Validate URL
        if (url) {
            try {
                new URL(url);
                
                // Attempt to load image
                imagePreview.onload = function() {
                    imagePreview.classList.add('active');
                    elements.saveSettingsButton.disabled = false;
                };
                
                imagePreview.onerror = function() {
                    imagePreview.classList.remove('active');
                    elements.saveSettingsButton.disabled = true;
                    alert('Invalid image URL. Please check the URL and try again.');
                };
                
                imagePreview.src = url;
            } catch (error) {
                alert('Invalid URL. Please enter a valid image URL.');
            }
        } else {
            imagePreview.classList.remove('active');
            elements.saveSettingsButton.disabled = true;
        }
    });

    // Modify the save settings button event listener to handle multiple background selection methods
    elements.saveSettingsButton.addEventListener('click', async () => {
        const customBackgroundUrl = elements.backgroundUrlInput.value.trim();
        
        // Check if there's a selected wallpaper
        const selectedWallpaperOption = document.querySelector('.wallpaper-option.selected');
        
        // Prioritize selection methods: Selected Wallpaper > URL Input > Uploaded Image
        let backgroundUrlToSave = '';
        
        if (selectedWallpaperOption) {
            // If a wallpaper option is selected
            backgroundUrlToSave = selectedWallpaperOption.dataset.url;
        } else if (customBackgroundUrl) {
            // If a URL is provided in the input
            backgroundUrlToSave = customBackgroundUrl;
        }
        
        if (backgroundUrlToSave) {
            // Validate URL
            try {
                new URL(backgroundUrlToSave);
                
                // Save background
                const saved = await saveBackgroundForUser(backgroundUrlToSave);
                
                if (saved) {
                    elements.loginMessage.textContent = 'Background saved successfully!';
                    elements.loginMessage.style.color = 'green';
                    
                    // Reset image preview and selection
                    imagePreview.classList.remove('active');
                    elements.wallpaperOptions.forEach(opt => opt.classList.remove('selected'));
                    elements.backgroundUrlInput.value = '';
                } else {
                    elements.loginMessage.textContent = 'Failed to save background.';
                    elements.loginMessage.style.color = 'red';
                }
            } catch (error) {
                elements.loginMessage.textContent = 'Invalid image URL. Please check the URL.';
                elements.loginMessage.style.color = 'red';
            }
        } else {
            elements.loginMessage.textContent = 'No background selected.';
            elements.loginMessage.style.color = 'red';
        }
    });

    // Modify handleFiles to use IP-based saving
    async function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            
            // Check if it's an image
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = async function(event) {
                    const imageUrl = event.target.result;
                    
                    // Update background URL input
                    elements.backgroundUrlInput.value = imageUrl;
                    
                    // Show image preview
                    imagePreview.src = imageUrl;
                    imagePreview.classList.add('active');
                    
                    // Deselect all wallpaper options
                    elements.wallpaperOptions.forEach(opt => opt.classList.remove('selected'));
                    
                    // Save the background
                    const saved = await saveBackgroundForUser(imageUrl);
                    
                    if (saved) {
                        elements.loginMessage.textContent = 'Background saved successfully!';
                        elements.loginMessage.style.color = 'green';
                        
                        // Enable save button
                        elements.saveSettingsButton.disabled = false;
                    } else {
                        elements.loginMessage.textContent = 'Failed to save background.';
                        elements.loginMessage.style.color = 'red';
                    }
                };
                
                reader.readAsDataURL(file);
            } else {
                alert('Please upload a valid image file.');
            }
        }
    }

    // Image Upload and Drag-Drop Functionality

    // Prevent default drag behaviors
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        elements.dragDropZone.classList.add('drag-over');
    }

    function unhighlight() {
        elements.dragDropZone.classList.remove('drag-over');
    }

    // Prevent drag behaviors from interfering with the entire UI
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        elements.dragDropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        elements.dragDropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    elements.dragDropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // Handle file click upload
    elements.dragDropZone.addEventListener('click', () => {
        elements.fileUpload.click();
    });

    elements.fileUpload.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Open settings menu
    elements.settingsButton.addEventListener('click', () => {
        elements.settingsMenu.style.display = 'flex';
        
        const username = localStorage.getItem('currentUser');
        
        if (username) {
            // User was previously logged in
            elements.loginUsername.value = username;
            
            // Automatically log in and enable settings
            elements.backgroundUrlInput.disabled = false;
            elements.saveSettingsButton.disabled = false;

            elements.loginMessage.textContent = 'Welcome back!';
            elements.loginMessage.style.color = 'green';

            // Switch to wallpaper settings tab
            elements.settingsSidebarItems.forEach(i => i.classList.remove('active'));
            elements.settingsSections.forEach(s => s.classList.remove('active'));
            document.querySelector('.settings-sidebar-item[data-section="wallpaper"]').classList.add('active');
            document.querySelector('.settings-section.wallpaper').classList.add('active');
        } else {
            // Reset login form and disable settings
            elements.loginUsername.value = '';
            elements.loginPassword.value = '';
            elements.loginMessage.textContent = '';
            
            elements.backgroundUrlInput.disabled = true;
            elements.saveSettingsButton.disabled = true;

            // Reset to login tab
            elements.settingsSidebarItems.forEach(i => i.classList.remove('active'));
            elements.settingsSections.forEach(s => s.classList.remove('active'));
            document.querySelector('.settings-sidebar-item[data-section="login"]').classList.add('active');
            document.querySelector('.settings-section.login').classList.add('active');
        }
    });

    // Close settings menu
    elements.closeSettingsButton.addEventListener('click', () => {
        elements.settingsMenu.style.display = 'none';
    });

    // Close settings menu if clicked outside
    elements.settingsMenu.addEventListener('click', (e) => {
        if (e.target === elements.settingsMenu) {
            elements.settingsMenu.style.display = 'none';
        }
    });

    // Context menu functionality

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        elements.contextMenu.style.display = 'block';
        elements.contextMenu.style.left = `${e.pageX}px`;
        elements.contextMenu.style.top = `${e.pageY}px`;
    });

    document.addEventListener('click', (e) => {
        if (!elements.contextMenu.contains(e.target)) {
            elements.contextMenu.style.display = 'none';
        }
    });

    // Add event listener for View Source
    const viewSourceItem = document.getElementById('viewSource');
    viewSourceItem.addEventListener('click', () => {
        window.open('https://github.com/IKHouvankaas/IKHouvankaas.github.io/tree/main/newtab/file', '_blank');
        elements.contextMenu.style.display = 'none';
    });

    elements.giveFeedbackItem.addEventListener('click', () => {
        window.open('https://forms.gle/cgaC5dxh3JtRW5Wy9', '_blank');
        elements.contextMenu.style.display = 'none';
    });

    // Add event listener for View Site
    const viewSiteItem = document.getElementById('viewSite');
    viewSiteItem.addEventListener('click', () => {
        window.open('https://ikhouvankaas.github.io/newtab/', '_blank');
        elements.contextMenu.style.display = 'none';
    });

    // On page load, try to restore background for current IP
    async function restoreBackgroundForCurrentUser() {
        try {
            const userIP = await getUserIP();
            const savedBackgrounds = JSON.parse(localStorage.getItem('foam_backgrounds') || '{}');
            
            const userBackground = savedBackgrounds[userIP];
            
            if (userBackground && userBackground.backgroundUrl) {
                document.body.style.backgroundImage = `url('${userBackground.backgroundUrl}')`;
            }
        } catch (error) {
            console.error('Error restoring background:', error);
        }
    }

    // Call restore background when page loads
    restoreBackgroundForCurrentUser();

    // Music Settings Functionality
    const musicElements = {
        urlInput: document.getElementById('musicUrlInput'),
        dragDropZone: document.getElementById('musicDragDropZone'),
        fileUpload: document.getElementById('musicFileUpload'),
        audioPlayer: document.getElementById('audioPlayer'),
        youtubePlayerContainer: document.getElementById('youtubePlayerContainer')
    };

    // YouTube Player API
    function loadYouTubeScript() {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }

    let youtubePlayer = null;
    window.onYouTubeIframeAPIReady = function() {
        // YouTube API is ready, but we'll initialize the player when needed
    };

    function createYouTubePlayer(videoId) {
        if (youtubePlayer) {
            youtubePlayer.destroy();
        }

        musicElements.audioPlayer.style.display = 'none';
        musicElements.youtubePlayerContainer.style.display = 'block';

        youtubePlayer = new YT.Player('youtubePlayerContainer', {
            height: '360',
            width: '640',
            videoId: videoId,
            playerVars: {
                'autoplay': 1
            }
        });
    }

    function extractYouTubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    function playAudioFile(fileOrUrl) {
        musicElements.youtubePlayerContainer.style.display = 'none';
        musicElements.audioPlayer.style.display = 'block';
        
        if (typeof fileOrUrl === 'string') {
            // URL
            musicElements.audioPlayer.src = fileOrUrl;
        } else {
            // File object
            musicElements.audioPlayer.src = URL.createObjectURL(fileOrUrl);
        }
        
        musicElements.audioPlayer.play();
    }

    function handleMusicInput(input) {
        const value = input.trim();
        
        // Check if it's a YouTube URL
        const youtubeVideoId = extractYouTubeVideoId(value);
        if (youtubeVideoId) {
            loadYouTubeScript();
            
            // Wait for YouTube API to be ready
            const checkYouTubeAPI = setInterval(() => {
                if (window.YT && window.YT.Player) {
                    clearInterval(checkYouTubeAPI);
                    createYouTubePlayer(youtubeVideoId);
                }
            }, 100);
            
            return;
        }
        
        // Check if it's an audio URL
        if (value.match(/\.(mp3|wav|ogg|m4a)$/i)) {
            playAudioFile(value);
            return;
        }
        
        alert('Invalid music URL. Please enter a valid YouTube link or direct audio file URL.');
    }

    // Music URL input handler
    musicElements.urlInput.addEventListener('change', (e) => {
        handleMusicInput(e.target.value);
    });

    // Drag and drop functionality for music files
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        musicElements.dragDropZone.classList.add('drag-over');
    }

    function unhighlight() {
        musicElements.dragDropZone.classList.remove('drag-over');
    }

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        musicElements.dragDropZone.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        musicElements.dragDropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        musicElements.dragDropZone.addEventListener(eventName, unhighlight, false);
    });

    function handleMusicFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            
            // Check if it's an audio file
            if (file.type.startsWith('audio/')) {
                playAudioFile(file);
            } else {
                alert('Please upload a valid audio file.');
            }
        }
    }

    musicElements.dragDropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleMusicFiles(files);
    });

    // Click to upload
    musicElements.dragDropZone.addEventListener('click', () => {
        musicElements.fileUpload.click();
    });

    musicElements.fileUpload.addEventListener('change', (e) => {
        handleMusicFiles(e.target.files);
    });

    // Modify existing setupMusicSettingsAccess function
    function setupMusicSettingsAccess() {
        const musicSection = document.querySelector('.settings-section.music');
        
        // Render full music settings immediately without access code
        musicSection.innerHTML = `
            <h2>Music Settings</h2>
            <div class="settings-subsection">
                <h3>Upload Music</h3>
                <div class="music-upload-area" id="musicUploadArea">
                    <input type="text" id="musicUrlInput" placeholder="Enter music file URL or YouTube link">
                    <div class="drag-drop-zone music-drag-drop-zone" id="musicDragDropZone">
                        <i class="fas fa-music"></i>
                        <p>Drag and drop music file here or click to upload</p>
                        <input type="file" id="musicFileUpload" accept="audio/*" style="display:none;">
                    </div>
                </div>
                <div class="music-player" id="musicPlayer">
                    <audio id="audioPlayer" controls style="display:none;"></audio>
                    <div id="youtubePlayerContainer" style="display:none;"></div>
                </div>
            </div>
        `;

        // Re-initialize music functionality
        const musicElements = {
            urlInput: document.getElementById('musicUrlInput'),
            dragDropZone: document.getElementById('musicDragDropZone'),
            fileUpload: document.getElementById('musicFileUpload'),
            audioPlayer: document.getElementById('audioPlayer'),
            youtubePlayerContainer: document.getElementById('youtubePlayerContainer')
        };

        musicElements.urlInput.addEventListener('change', (e) => {
            handleMusicInput(e.target.value);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function highlight() {
            musicElements.dragDropZone.classList.add('drag-over');
        }

        function unhighlight() {
            musicElements.dragDropZone.classList.remove('drag-over');
        }

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            musicElements.dragDropZone.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            musicElements.dragDropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            musicElements.dragDropZone.addEventListener(eventName, unhighlight, false);
        });

        function handleMusicFiles(files) {
            if (files.length > 0) {
                const file = files[0];
                
                // Check if it's an audio file
                if (file.type.startsWith('audio/')) {
                    playAudioFile(file);
                } else {
                    alert('Please upload a valid audio file.');
                }
            }
        }

        musicElements.dragDropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleMusicFiles(files);
        });

        musicElements.dragDropZone.addEventListener('click', () => {
            musicElements.fileUpload.click();
        });

        musicElements.fileUpload.addEventListener('change', (e) => {
            handleMusicFiles(e.target.files);
        });
    }

    // Call this function when the page loads
    setupMusicSettingsAccess();
});
