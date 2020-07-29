const ticTacToeGame = new TicTacToeGame();
ticTacToeGame.start();

document.getElementById('reset').addEventListener('click', ticTacToeGame.resetGame);
document.getElementById('revert').addEventListener('click', ticTacToeGame.revertGame);

function TicTacToeGame() {
  let moves = [];
  const board = new Board();
  const humanPlayer = new HumanPlayer(board, moves);
  const computerPlayer = new ComputerPlayer(board, moves);
  let turn = 0;

  this.start = function() {
    const config = {
      childList: true
    };
    const observer = new MutationObserver((mut) => {
      console.log(mut);
      if (mut[0].addedNodes.length > 0) {
        console.log('taking turn', turn);
        takeTurn();
      }
    });
    board.positions.forEach((el) => observer.observe(el, config))
    takeTurn();
  }

  function takeTurn() {
    if (board.checkForWinner()) {
      return;
    }
    console.log(turn);
    if (turn % 2 === 0) {
      humanPlayer.takeTurn();
    } else {
      computerPlayer.takeTurn();
    }
    turn++;
  }
  this.resetGame = function() {
    turn = -1;
    moves.length = 0;
    board.positions.forEach(el => {
      el.innerText = '';
      el.classList.remove('winner');
    });
  }
  this.revertGame = function() {
    if (board.checkForWinner()) {
      board.positions.forEach(el => {
        el.classList.remove('winner');
      });
    }
    if (moves.length > 0) {
      moves.pop().innerText = '';
      moves.pop().innerText = '';
    }
  }
}

function Board() {
  this.positions = Array.from(document.querySelectorAll('.col'));
  // 0 1 2
  // 3 4 5
  // 6 7 8

  this.checkForWinner = function() {
    let winner = false;
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    const positions = this.positions;
    winningCombinations.forEach(winningCombo => {
      const pos0 = positions[winningCombo[0]].innerText;
      const pos1 = positions[winningCombo[1]].innerText;
      const pos2 = positions[winningCombo[2]].innerText;
      const isWinningCombo = pos0 !== '' && pos0 === pos1 && pos1 === pos2;
      if (isWinningCombo) {
        winner = true;
        winningCombo.forEach(i => positions[i].className += ' winner');
      }

    })
    return winner;
  }
}

function HumanPlayer(board, moves) {
  this.takeTurn = function() {
    board.positions.forEach(el => el.addEventListener('click', handleTakeTurn));

  }

  function handleTakeTurn(event) {
    console.log('clicking');
    event.target.innerText = 'X';
    moves.push(event.target);
    board.positions.forEach(el => el.removeEventListener('click', handleTakeTurn));
  }
}

function ComputerPlayer(board, moves) {
  this.takeTurn = function() {
    const availablePositions = board.positions.filter(p => p.innerText === '');
    const move = Math.floor(Math.random() * availablePositions.length);
    availablePositions[move].innerText = 'O';
    moves.push(availablePositions[move]);

  }
}