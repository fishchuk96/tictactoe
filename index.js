'use strict';

const gameBoard = document.querySelector('tbody');
const line = document.querySelector('.line');
const gameText = document.querySelector('h3');
const gameSize = 5;
let step = true;
let drawChecker = false;
let table = createMatrix([], gameSize);
let win = false;
let width;

drawTable(gameSize);
const elements = document.querySelectorAll('td');

elements.forEach((el) => el.addEventListener('click', () => {
    if (win) {
        return;
    } else {
        let [row, col] = el.id.split('_');
        
        if (step && table[row][col] === undefined) {
            el.innerHTML = `
                <svg class="xelement icon">
                    <path class="xclassFrom" stroke="rgb(59, 74, 115)" stroke-width="6"></path>
                    <path class="xclassTo" stroke="rgb(59, 74, 115)" stroke-width="6"></path>
                </svg>
            `;
            gameInfo(row, col, 'X', 'O turn');
            step = false;
        } else if (table[row][col] === undefined) {
            el.innerHTML = `
                <svg class="oelement icon">
                    <circle class="oclass" stroke="rgb(76, 108, 239)" stroke-width="6" fill="none"/>
                </svg>
            `;
            gameInfo(row, col, 'O', 'X turn');
            step = true;
        }
    }
    
}));

//check winner and add game info
function gameInfo(row, col, marker, gameLabel) {
    table[row][col] = marker;
    gameText.innerHTML = gameLabel;
    if (calculateWinner(row, col)) {
        let [x, y, x1, y1] = calculateWinner(row, col);
        
        printLine(countCoordinate(x), countCoordinate(y), countCoordinate(x1), countCoordinate(y1));
        gameText.innerHTML = `${table[row][col]} win!`;
        win = true;
        return;
    }

    drawChecker = isFull(table);
    if (!drawChecker) gameText.innerHTML = 'Draw!';
}

//clear game board and properties
function clearTable() {
    step = true;
    table = createMatrix([], gameSize);
    drawChecker = false;
    win = false;
    gameText.innerHTML = 'X first move';
    let svg = document.querySelector('#svg');
    svg.style.visibility = 'hidden';
    document.querySelectorAll('.icon').forEach(icon => icon.style.display = 'none');
}

function calculateWinner(cellX, cellY) {
    let res = null;	
    let newFig = getFig(cellX,cellY);
    let fromX, fromY, toX, toY;
	if( ! newFig ) return false;

	res = res || checkLine( cellX, cellY, 1, 0 ); //vertical
	res = res || checkLine( cellX, cellY, 0, 1 ); //horizontal
	res = res || checkLine( cellX, cellY, 1, 1 ); //diagonal 
	res = res || checkLine( cellX, cellY, 1, -1 ); //diagonal 	
    
	return res;

	function getFig( x, y ){
		return table[x] && table[x][y] ? table[x][y] : 'b';
	}

	function checkLine( x, y, dx, dy ){
        fromX = x;
        fromY = y;
		x = +x;
		y = +y;
		var score = 0;
		while( getFig( x - dx, y - dy ) == newFig ){
			x -= dx;	
            y -= dy;
            fromX = x;
            fromY = y;
		}
		while( getFig( x, y ) == newFig ){
            toX = x;
            toY = y;
			x += dx;
            y += dy;
            score++;
        }	
        if( score >= 4 ) {
            return [fromX, fromY, toX, toY];
        }
		
		return false;
	}
}

//check if array if full
function isFull(array) {
    let check = false;
    for (let i = 0; i < gameSize; i++) {
        for (let j = 0; j < gameSize; j++) {
            if (array[i][j] === undefined) check = true;
        } 
    }
    if (check) return true;
}

function createMatrix(array, gameSize) {
    for(var i = 0; i < gameSize; i++) {
        array[i] = new Array(gameSize);
    }
    return array;
}

function drawTable(tableSize) {
    for (let row = 0; row < tableSize; row++) {
        let rowSection = document.createElement('tr');
        gameBoard.appendChild(rowSection);
        for (let col = 0; col < tableSize; col++) {
            let td = document.createElement('td');
            td.setAttribute('id', `${row}_${col}`);
            rowSection.appendChild(td);
            width = td.offsetWidth;
        }
    }  
    
 
} 

function countCoordinate (val) {
    return (val * width ) + (width / 2);
 }

function printLine(x1, y1, x2, y2) {
    let svg = document.querySelector('#svg');
    let line = document.querySelector('#line');
    svg.style.width = gameSize * width;
    svg.style.height = gameSize * width;
    line.setAttribute('x1', y1);
    line.setAttribute('y1', x1);
    line.setAttribute('x2', y2);
    line.setAttribute('y2', x2);
    svg.style.visibility = 'visible'; 
}