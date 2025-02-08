document.addEventListener('DOMContentLoaded', () => {
    const browserButtons = document.querySelectorAll('.download-btn');
    
    browserButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const browserName = button.classList[1];
            alert(`FOAM ${browserName.charAt(0).toUpperCase() + browserName.slice(1)} Extension - Coming Soon!`);
        });
    });
});
