function myGame() {
const page = document.querySelector('.page');
const gameNode = document.getElementById('game');
const containerNode = document.getElementById('fifteen');
const itemNodes = Array.from(containerNode.querySelectorAll('.item'));
const button = document.querySelector('[data-modal-button]');
const modal = document.querySelector('[data-modal]');
const buttonClose = document.querySelector('[data-modal-close]');
const textCountVal = document.getElementById('textCount');
const textVelocityVal = document.getElementById('textVelocity');
const countItems = 16;
const scoreSpan = document.querySelector('#score');
let score = 0;
scoreSpan.innerText = score;
const myWin = new Audio(); 
myWin.src = 'win.mp3';
lbltextCountVal = textCountVal.innerText;
lbltextVelocityVal = textVelocityVal.innerText;


function backgroundImg() {
    let backgrndRandom = Math.floor(Math.random() * 10) + 1;
    if (backgrndRandom <= 2) {
    page.classList.add('one');
    } else if (backgrndRandom <= 4 && backgrndRandom > 2) {
        page.classList.add('two');
    } else if (backgrndRandom <= 6 && backgrndRandom > 4){
        page.classList.add('three');
    } else if (backgrndRandom <= 8 && backgrndRandom > 6){
        page.classList.add('four');
    } else if (backgrndRandom <= 10 && backgrndRandom > 8){
        page.classList.add('five');
    } else {
        page.classList.add('three');
    }
}

backgroundImg();

button.addEventListener('click', function () {
    modal.classList.remove('hidden');
    
    });
    
    buttonClose.addEventListener('click', function () {
    modal.classList.add('hidden');
    });
    
    modal.addEventListener('click', function () {
    modal.classList.add('hidden');
    });
    
    modal.querySelector('.modal-window').addEventListener('click', function (event) { 
    event.stopPropagation(); 
    });   

if (itemNodes.length !== 16) {
throw new Error (`Must be ${countItems} items in HTML`);
}

itemNodes[countItems - 1].style.display = 'none';
let matrix = getMatrix(
    itemNodes.map((item) => Number(item.dataset.matrixId))
);

setPositionItems(matrix);

const maxShuffleCount = lbltextCountVal;
let timer;
let shuffled = false;

const shuffledClassName = 'gameShuffle';
const fifteenWonend = 'fifteenWonend';
function goShuffle() {
    score = 0;
    scoreSpan.innerText = score;
    gameNode.classList.remove(fifteenWonend);

  if (shuffled) {
    return;
  }
  shuffled = true;
  let shuffleCount = 0;
  clearInterval(timer);
  gameNode.classList.add(shuffledClassName);

  if (shuffleCount === 0) {
timer = setInterval(() => {
    randomSwap(matrix);
    setPositionItems(matrix);

    shuffleCount += 1;

    if (shuffleCount >= maxShuffleCount) {
        gameNode.classList.remove(shuffledClassName);
        clearInterval(timer);
        shuffled = false;
    }
}, lbltextVelocityVal);
  }
}

document.getElementById('shuffle').addEventListener('click', myGame);

const blankNumber = 16; 
containerNode.addEventListener('click', (event) => {
    if (shuffled) {
        return;
    }
    const buttonNode = event.target.closest('button');
    if (!buttonNode) {
        return;
    }
    const buttonNumber = Number(buttonNode.dataset.matrixId);
    const buttonCoords = findCoordinatesByNumber(buttonNumber, matrix);
    const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
    const isValid = isValidForSwap(buttonCoords, blankCoords);

    if (isValid) {
swap(blankCoords, buttonCoords, matrix);
setPositionItems(matrix);
score = score + 1;
scoreSpan.innerText = score;
    }
});

window.addEventListener('keydown', (event) => {
    if (shuffled) {
        return;
    }
    if (!event.key.includes('Arrow')){
        return;
    }
    const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
    const buttonCoords = {
        x: blankCoords.x,
        y: blankCoords.y,
    };

const direction = event.key.split('Arrow')[1].toLowerCase();
const maxIndexMatrix = matrix.length;

    switch (direction) {
case 'up':
buttonCoords.y += 1;
break;
case 'down':
buttonCoords.y -= 1;
break;
case 'left':
buttonCoords.x += 1;
break;
case 'right':
buttonCoords.x -= 1;
break;
    }
    if (buttonCoords.y >= maxIndexMatrix || buttonCoords.y < 0 || 
        buttonCoords.x >= maxIndexMatrix || buttonCoords.x < 0){
return;
    }

swap(blankCoords, buttonCoords, matrix);
setPositionItems(matrix);
score = score + 1;
scoreSpan.innerText = score;
});

let blockedCoords = null;
function randomSwap (matrix) {
const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
const validCoords = findValidCoords({
    blankCoords,
    matrix,
    blockedCoords,
});

const swapCoords = validCoords[
Math.floor(Math.random() * validCoords.length)
];
swap(blankCoords, swapCoords, matrix);
blockedCoords = blankCoords;
}

function findValidCoords ({ blankCoords, matrix, blockedCoords }) {
    const validCoords = [];
    for(let y = 0; y < matrix.length; y++){
        for(let x = 0; x < matrix[y].length; x++){
           if (isValidForSwap({x,y}, blankCoords)) {
            if (!blockedCoords || !(
                blockedCoords.x === x && blockedCoords.y === y
            )) {
              validCoords.push({x, y});
            }
           }
        }
    }

    return validCoords;
}

function getMatrix(arr) {
    const matrix = [[], [], [], []];
    let y = 0;
    let x = 0;

    for(let i = 0; i < arr.length; i++) {
        if (x >= 4){
            y++;
            x = 0;
        }
        matrix[y][x] = arr[i];
        x++;
    }

    return matrix;
}

function setPositionItems(matrix) {
 for(let y = 0; y < matrix.length; y++){
    for(let x = 0; x < matrix[y].length; x++){
      const value = matrix[y][x];
      const node = itemNodes[value - 1];
      setNodeStyles(node, x, y);
    }    
 }
}

function setNodeStyles(node, x, y) {
const shiftPs = 100;
node.style.transform = `translate3D(${x * shiftPs}%, ${y * shiftPs}%, 0)`
}

function shuffleArray(arr) {
    return arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({value}) => value);
}

function findCoordinatesByNumber(number, matrix) {
    for(let y = 0; y < matrix.length; y++){
        for(let x = 0; x < matrix[y].length; x++){
if (matrix[y][x] === number){
return {x, y};
}
        }
    }
    return null;
}

function isValidForSwap(coords1, coords2) {
const diffX = Math.abs(coords1.x - coords2.x);
const diffY = Math.abs(coords1.y - coords2.y);

return (diffX === 1 || diffY === 1) && (coords1.x === coords2.x || coords1.y === coords2.y)
}

function swap (coords1, coords2, matrix) {
    const coords1Number = matrix[coords1.y][coords1.x];
    matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
    matrix[coords2.y][coords2.x] = coords1Number;

    if (isWon(matrix)) {
        addWonClass();
        myWin.play();
    }
}

const winFlatArr = new Array(16).fill(0).map((_item, i) => i + 1);

function isWon(matrix) {
const flatMatrix = matrix.flat();
for (let i = 0; i < winFlatArr.length; i++) {
    if (flatMatrix[i] !== winFlatArr[i]) {
return false;
    }
} 
return true;
}

const wonClass = 'fifteenWon'
function addWonClass() {
setTimeout(() => {
    containerNode.classList.add(wonClass);
    gameNode.classList.add(shuffledClassName);
    setTimeout(() => {
        containerNode.classList.remove(wonClass);
        gameNode.classList.add(fifteenWonend);
        gameNode.classList.remove(shuffledClassName);
    }, 7000);
}, 200);
}


setTimeout(function() {
    goShuffle();
}, 500);
}
myGame();


