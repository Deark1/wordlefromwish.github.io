document.querySelectorAll('#grid div').forEach(square => {
    square.setAttribute('contenteditable', 'true');
    square.style.textAlign = 'center';
    square.style.fontSize = '32px'; // Make the letter bigger

    square.addEventListener('input', function() {
        // Limit to one uppercase letter
        this.textContent = this.textContent.slice(0, 1).toUpperCase();
    });

    square.addEventListener('keypress', function(e) {
        // Prevent more than one character
        if (this.textContent.length >= 1) {
            e.preventDefault();
        }
    });
});


const gridContainer = document.getElementById('grid');

// Clear existing grid (if any)
gridContainer.innerHTML = '';

// Create 30 squares (5 columns x 6 rows)
for (let i = 0; i < 30; i++) {
    const square = document.createElement('div');
    square.classList.add('grid-item');
    square.setAttribute('contenteditable', 'true');
    gridContainer.appendChild(square);
}
