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
      const columnIsSameWithRed = redPosition[0] === columnIndexForBlack;
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

const moveBlacksPositions = () => {};

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
      moveBlacksPositions();
      render();
    }
  };

  const goToUp = () => {
    const currentMovedPosition = [redPosition[0] - 1, redPosition[1]];
    if (board[currentMovedPosition[0]][currentMovedPosition[1]] === "") {
      board[redPosition[0]][redPosition[1]] = "";
      board[currentMovedPosition[0]][currentMovedPosition[1]] = "red";
      moveBlacksPositions();
      render();
    }
  };

  const goToRight = () => {
    const currentMovedPosition = [redPosition[0], redPosition[1] + 1];
    if (board[currentMovedPosition[0]][currentMovedPosition[1]] === "") {
      board[redPosition[0]][redPosition[1]] = "";
      board[currentMovedPosition[0]][currentMovedPosition[1]] = "red";
      moveBlacksPositions();
      render();
    }
  };

  const goToLeft = () => {
    const currentMovedPosition = [redPosition[0], redPosition[1] - 1];
    if (board[currentMovedPosition[0]][currentMovedPosition[1]] === "") {
      board[redPosition[0]][redPosition[1]] = "";
      board[currentMovedPosition[0]][currentMovedPosition[1]] = "red";
      moveBlacksPositions();
      render();
    }
  };

  const eventActions = {
    ArrowDown: goToDown,
    ArrowUp: goToUp,
    ArrowRight: goToRight,
    ArrowLeft: goToLeft,
  };

  if (eventActions?.[event.code]) {
    event.preventDefault();
    eventActions[event.code]();
  }
};

const moveControl = () => {
  document.removeEventListener("keydown", moveRedBox);
  document.addEventListener("keydown", moveRedBox);
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
