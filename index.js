const root = document.querySelector(".root");
let blackBoxMovingStatus = false;

class Board {
  constructor() {
    this.board = this.#init();
    return this.board;
  }

  #getRedPosition() {
    const randomIndexesTwoStartRed = [
      [0, 0],
      [0, 5],
      [5, 0],
      [5, 5],
    ];
    const redPositionIndex = Math.floor(Math.random() * 4);

    return randomIndexesTwoStartRed[redPositionIndex];
  }

  #getBlackPositions([redRow, redCol]) {
    const boardSize = 6;
    const mid = Math.floor(boardSize / 2);

    const rowOffset = redRow === 0 ? boardSize - 1 : 0;
    const colOffset = redCol === 0 ? boardSize - 1 : 0;

    return [
      [rowOffset, mid - 1],
      [rowOffset, mid],
      [mid - 1, colOffset],
      [mid, colOffset],
    ];
  }

  // Random black Box logic.

  // #getBlackPositions(redPosition) {
  //   const result = [];

  //   function loop() {
  //     const rowIndexForBlack = Math.floor(Math.random() * 6);
  //     const columnIndexForBlack = Math.floor(Math.random() * 6);

  //     const rowIsSameWithRed = redPosition[0] === rowIndexForBlack;
  //     const columnIsSameWithRed = redPosition[1] === columnIndexForBlack;
  //     const isSameBoxWithRed = rowIsSameWithRed && columnIsSameWithRed;

  //     const hasBlack = result.find(
  //       ([keptRowIndexForBlack, keptColumnIndexForBlack]) => {
  //         return (
  //           keptRowIndexForBlack === rowIndexForBlack &&
  //           keptColumnIndexForBlack === columnIndexForBlack
  //         );
  //       }
  //     );

  //     if (result.length === 4) {
  //       return result;
  //     }

  //     if (isSameBoxWithRed || hasBlack) {
  //       return loop();
  //     } else {
  //       result.push([rowIndexForBlack, columnIndexForBlack]);
  //       return loop();
  //     }
  //   }

  //   return loop();
  // }

  #init() {
    const board = [
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
    ];

    const redPosition = this.#getRedPosition();
    board[redPosition[0]][redPosition[1]] = "red";

    const blackPositions = this.#getBlackPositions(redPosition);
    blackPositions.forEach(([rowIndexForBlack, columnIndexForBlack]) => {
      board[rowIndexForBlack][columnIndexForBlack] = "black";
    });

    return board;
  }
}

const board = new Board();

const getBlackBoxPositions = () => {
  const blackBoxes = [];

  board.forEach((row, rowIndex) => {
    row.forEach((box, columnIndex) => {
      if (box === "black") {
        blackBoxes.push([rowIndex, columnIndex]);
      }
    });
  });

  return blackBoxes;
};

const getNearestPositionIntoRed = (blackPosition) => {
  const [blackRow, blackCol] = blackPosition;
  const [redRow, redCol] = getRedBoxPosition();

  const possibleMoves = [
    [blackRow - 1, blackCol],
    [blackRow + 1, blackCol],
    [blackRow, blackCol - 1],
    [blackRow, blackCol + 1],
  ];

  const validMoves = possibleMoves.filter(([row, col]) => {
    return row >= 0 && col >= 0 && row < 6 && col < 6 && board[row][col] === "";
  });

  if (validMoves.length === 0) {
    return [blackRow, blackCol];
  }

  return validMoves.reduce((bestMove, currentMove) => {
    const [currentRow, currentCol] = currentMove;
    const [bestRow, bestCol] = bestMove;

    const currentDistance =
      Math.abs(currentRow - redRow) + Math.abs(currentCol - redCol);
    const bestDistance =
      Math.abs(bestRow - redRow) + Math.abs(bestCol - redCol);

    return currentDistance < bestDistance ? currentMove : bestMove;
  }, validMoves[0]);
};

const moveBlacksPositions = () => {
  blackBoxMovingStatus = true;

  const blackBoxes = getBlackBoxPositions();

  blackBoxes.forEach((blackBox, index) => {
    setTimeout(() => {
      const [currentRow, currentCol] = blackBox;
      const newPosition = getNearestPositionIntoRed(blackBox);

      if (newPosition[0] !== currentRow || newPosition[1] !== currentCol) {
        board[currentRow][currentCol] = "";
        board[newPosition[0]][newPosition[1]] = "black";
      }

      if (index === blackBoxes.length - 1) {
        blackBoxMovingStatus = false;
      }

      render();
    }, 200 * (index + 1)); // Delay each move for better visualization
  });
};

const getRedBoxPosition = () => {
  return board.reduce((acc, row, rowIndex) => {
    const columnIndex = row.findIndex((boxValue) => boxValue === "red");

    if (columnIndex !== -1) {
      acc = [rowIndex, columnIndex];
    }

    return acc;
  }, []);
};

const moveRedBox = (event) => {
  if (blackBoxMovingStatus) return;

  const redPosition = getRedBoxPosition();

  const goToDown = () => {
    const currentMovedPosition = [redPosition[0] + 1, redPosition[1]];
    if (board[currentMovedPosition[0]][currentMovedPosition[1]] === "") {
      board[redPosition[0]][redPosition[1]] = "";
      board[currentMovedPosition[0]][currentMovedPosition[1]] = "red";
      render();
      moveBlacksPositions();
    }
  };

  const goToUp = () => {
    const currentMovedPosition = [redPosition[0] - 1, redPosition[1]];
    if (board[currentMovedPosition[0]][currentMovedPosition[1]] === "") {
      board[redPosition[0]][redPosition[1]] = "";
      board[currentMovedPosition[0]][currentMovedPosition[1]] = "red";
      render();
      moveBlacksPositions();
    }
  };

  const goToRight = () => {
    const currentMovedPosition = [redPosition[0], redPosition[1] + 1];
    if (board[currentMovedPosition[0]][currentMovedPosition[1]] === "") {
      board[redPosition[0]][redPosition[1]] = "";
      board[currentMovedPosition[0]][currentMovedPosition[1]] = "red";
      render();
      moveBlacksPositions();
    }
  };

  const goToLeft = () => {
    const currentMovedPosition = [redPosition[0], redPosition[1] - 1];
    if (board[currentMovedPosition[0]][currentMovedPosition[1]] === "") {
      board[redPosition[0]][redPosition[1]] = "";
      board[currentMovedPosition[0]][currentMovedPosition[1]] = "red";
      render();
      moveBlacksPositions();
    }
  };

  const eventActions = {
    ArrowDown: goToDown,
    ArrowUp: goToUp,
    ArrowRight: goToRight,
    ArrowLeft: goToLeft,
  };

  if (eventActions?.[event.code]) {
    event?.preventDefault?.();
    eventActions[event.code]();
  }
};

const moveControl = () => {
  document.removeEventListener("keydown", moveRedBox);
  document.addEventListener("keydown", moveRedBox);

  const buttonToTop = document.querySelector(".button-to-top");
  const buttonToDown = document.querySelector(".button-to-down");
  const buttonToLeft = document.querySelector(".button-to-left");
  const buttonToRight = document.querySelector(".button-to-right");

  buttonToTop.onclick = () => moveRedBox({ code: "ArrowUp" });
  buttonToDown.onclick = () => moveRedBox({ code: "ArrowDown" });
  buttonToLeft.onclick = () => moveRedBox({ code: "ArrowLeft" });
  buttonToRight.onclick = () => moveRedBox({ code: "ArrowRight" });
};

const render = () => {
  root.innerHTML = "";
  board.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.classList.add("row");

    row.forEach((column) => {
      const boxEl = document.createElement("div");
      boxEl.classList.add("box");
      column && boxEl.classList.add(column);
      rowEl.appendChild(boxEl);
    });

    root.appendChild(rowEl);
  });

  moveControl();
};

render();
