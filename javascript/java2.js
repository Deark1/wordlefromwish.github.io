let grid = document.getElementById('grid');

    for (let i = 0; i < 30; i++) {
        let item = document.createElement('div');
        item.className = 'grid-item';
        grid.appendChild(item);
    }

let refreshPage = document.getElementById('playAgain');
