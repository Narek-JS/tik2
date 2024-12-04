const root = document.querySelector(".root");

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

  #getBlackPositions(redPosition) {
    const result = [];

    function loop() {
      const rowIndexForBlack = Math.floor(Math.random() * 6);
      const columnIndexForBlack = Math.floor(Math.random() * 6);

      const rowIsSameWithRed = redPosition[0] === rowIndexForBlack;
      const columnIsSameWithRed = redPosition[1] === columnIndexForBlack;
      const isSameBoxWithRed = rowIsSameWithRed && columnIsSameWithRed;

      const hasBlack = result.find(
        ([keptRowIndexForBlack, keptColumnIndexForBlack]) => {
          return (
            keptRowIndexForBlack === rowIndexForBlack &&
            keptColumnIndexForBlack === columnIndexForBlack
          );
        }
      );

      if (result.length === 4) {
        return result;
      }

      if (isSameBoxWithRed || hasBlack) {
        return loop();
      } else {
        result.push([rowIndexForBlack, columnIndexForBlack]);
        return loop();
      }
    }

    return loop();
  }

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
  const [blackRowIndex, blackColumnIndex] = blackPosition;
  const [redRowIndex, redColumnIndex] = getRedBoxPosition();

  let nextRow = blackRowIndex;
  let nextCol = blackColumnIndex;

  if (blackRowIndex < redRowIndex) {
    nextRow = blackRowIndex + 1;
  } else if (blackRowIndex > redRowIndex) {
    nextRow = blackRowIndex - 1;
  }

  if (blackColumnIndex < redColumnIndex) {
    nextCol = blackColumnIndex + 1;
  } else if (blackColumnIndex > redColumnIndex) {
    nextCol = blackColumnIndex - 1;
  }

  const canMoveUp =
    redRowIndex > 0 && board[redRowIndex - 1]?.[redColumnIndex] === "";
  const canMoveDown =
    redRowIndex < 5 && board[redRowIndex + 1]?.[redColumnIndex] === "";

  if (canMoveUp || canMoveDown) {
    if (blackRowIndex < redRowIndex) {
      nextRow = redRowIndex - 1;
    } else if (blackRowIndex > redRowIndex) {
      nextRow = redRowIndex + 1;
    }
  }

  if (board[nextRow]?.[nextCol] === "") {
    return [nextRow, nextCol];
  }

  if (board[nextRow]?.[blackColumnIndex] === "") {
    return [nextRow, blackColumnIndex];
  }
  if (board[blackRowIndex]?.[nextCol] === "") {
    return [blackRowIndex, nextCol];
  }

  return [blackRowIndex, blackColumnIndex];
};

const moveBlacksPositions = () => {
  const blackBoxes = getBlackBoxPositions();

  const nearestPositionFor1 = getNearestPositionIntoRed(blackBoxes[0]);
  board[blackBoxes[0][0]][blackBoxes[0][1]] = "";
  board[nearestPositionFor1[0]][nearestPositionFor1[1]] = "black";
  render();

  const nearestPositionFor2 = getNearestPositionIntoRed(blackBoxes[1]);
  board[blackBoxes[1][0]][blackBoxes[1][1]] = "";
  board[nearestPositionFor2[0]][nearestPositionFor2[1]] = "black";
  render();

  const nearestPositionFor3 = getNearestPositionIntoRed(blackBoxes[2]);
  board[blackBoxes[2][0]][blackBoxes[2][1]] = "";
  board[nearestPositionFor3[0]][nearestPositionFor3[1]] = "black";
  render();

  const nearestPositionFor4 = getNearestPositionIntoRed(blackBoxes[3]);
  board[blackBoxes[3][0]][blackBoxes[3][1]] = "";
  board[nearestPositionFor4[0]][nearestPositionFor4[1]] = "black";
  render();
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
