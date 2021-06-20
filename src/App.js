import logo from "./logo.svg";
import "./App.css";
import { useState, useRef } from "react";
import useInterval from "./useInterval";

function App() {
  const timer = useRef(null);
  const squareSize = 25;
  const [rows, setRows] = useState(27);
  const [columns, setColumns] = useState(40);
  const [speed, setSpeed] = useState(100);
  const [start, setStart] = useState(false);
  const initialState = Array(rows);
  for (let i = 0; i < initialState.length; i++) {
    initialState[i] = new Array(columns).fill(0);
  }

  const [board, setBoard] = useState(initialState);

  const nextGen = () => {
    let tempBoard = JSON.parse(JSON.stringify(board));

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        /**
         * How to find adjacent cells
         *
         * [7][8][9]
         * [4][5][6]
         * [1][2][3]
         *
         * 9 => [row-1][col+1] - d
         * 8 => [row-1][col]  - d
         * 7 => [row-1][col-1] - d
         * 6 => [row][col+1]  - d
         * 5 => cell
         * 4 => [row][col-1] - d
         * 3 => [row+1][col+1]
         * 2 => [row+1][col]
         * 1 => [row+1][col-1]
         */

        let neighbours = [];

        // 9
        if (row - 1 in board && col + 1 in board[row])
          neighbours.push(board[row - 1][col + 1]);

        // 8
        if (row - 1 in board) neighbours.push(board[row - 1][col]);

        // 7
        if (row - 1 in board && col - 1 in board[row])
          neighbours.push(board[row - 1][col - 1]);

        // 6
        if (col + 1 in board[row]) neighbours.push(board[row][col + 1]);

        // 4
        if (col - 1 in board[row]) neighbours.push(board[row][col - 1]);

        // 3
        if (row + 1 in board && col + 1 in board[row])
          neighbours.push(board[row + 1][col + 1]);

        // 2
        if (row + 1 in board) neighbours.push(board[row + 1][col]);

        // 1
        if (row + 1 in board && col - 1 in board[row])
          neighbours.push(board[row + 1][col - 1]);
        const neighboursCount = neighbours.reduce((acc, current) => {
          if (current == 1) {
            acc += 1;
          }
          return acc;
        }, 0);

        // Any live cell with more than three live neighbours dies, as if by overpopulation.
        if (neighboursCount > 3 && board[row][col] === 1) {
          // set state dead
          tempBoard[row][col] = 0;
          continue;
        }

        // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        if (neighboursCount === 3 && board[row][col] === 0) {
          // set state alive
          tempBoard[row][col] = 1;
          continue;
        }

        // Any live cell with two or three live neighbours lives on to the next generation.
        // if (
        //   neighboursCount >= 2 &&
        //   neighboursCount <= 3 &&
        //   board[row][col] === 0
        // ) {
        //   // set state alive
        //   tempBoard[row][col] = 1;
        //   continue;
        // }

        // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        if (neighboursCount < 2 && board[row][col] === 1) {
          // set state
          tempBoard[row][col] = 0;
          continue;
        }
      }
    }
    setBoard((prev) => tempBoard);
  };

  useInterval(nextGen, start ? speed : null);

  return (
    <div className="App">
      <div>
        <button
          onClick={() => {
            setStart((prev) => !prev);
          }}
        >
          {start ? "Stop" : "Start"}
        </button>
        <button onClick={() => setBoard(initialState)}>Reset</button>
      </div>
      <table
        style={{
          border: "1px solid grey",
          borderCollapse: "collapse",
        }}
      >
        <tbody>
          {board.map((row, x) => (
            <tr key={`row-${x}`}>
              {row.map((col, y) => (
                <td
                  key={`col-${x}-${y}-${col}`}
                  onClick={() => {
                    let temp = [...board];
                    temp[x][y] = temp[x][y] === 0 ? 1 : 0;
                    setBoard((prev) => temp);
                  }}
                  style={{
                    width: `${squareSize}px`,
                    height: `${squareSize}px`,
                    border: "1px solid grey",
                    background: col ? "black" : "white",
                  }}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
