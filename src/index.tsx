import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

interface SquareProps{value: any | null, onClick: () => void, inLines: Boolean}
function Square (props: SquareProps) {
    return (
      <button  style={ props.inLines ? { background: 'green' } : {}}
      className="square" 
      onClick={() => props.onClick()}
       >
        {props.value}
      </button>
    );
  
}

interface BoardProp{squares: Array<any>, onClick: (i: number) => void, winner: {letter: string, lines: number[]} | null}
function Board ({squares, onClick, winner}: BoardProp) {
  function renderSquare(i: number) {
    return <Square 
      value={squares[i]} 
      onClick={() => onClick(i)}
      inLines={winner?.lines.includes(i) || false}  
    />;
  }
  function loopSquare(){
    let squareArray = []
    let rowArray = []
    for (let i = 0 ;i<9; i++){
      squareArray.push(renderSquare(i))
    }

    for(let row=0; row<3; row++){
        rowArray.push(<div className="board-row">{squareArray.slice((row*3), (row*3)+3)}</div>)    
    }

    //leaving solution here for study purposes

    // for(let row=0; row<3; row++){
    //   let squareArray = []
    //   for (let i = row*3 ; i<(row*3)+3; i++){
    //     squareArray.push(this.renderSquare(i))
    //   }
    //   rowArray.push(<div className="board-row">{squareArray}</div>)
    // }

    return rowArray
   
  }
    return (
      <div>
          {loopSquare()}
      </div>
    );
  
}

function calculateWinner(squares: Array<any>){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {letter: squares[a], lines: lines[i]} ;
    }
  }
  return null;
}

// interface GameState{xIsNext: Boolean, history: Array<any>, stepNumber: number, coordinates: Array<any>}
function Game()  {
  // constructor(props: {}){
  //   super(props);
  //   this.state = {
  //     history: [{
  //       squares: Array(9).fill(null),
  //     }],
  //     stepNumber: 0,
  //     xIsNext: true,
  //     coordinates: [{
  //       col: 0,
  //       row: 0,
  //     }]
  //   }
  // }
  const [history, setHistory] = useState([{squares: Array(9).fill(null) }])
  const [stepNumber, setStepNumber] = useState(0)
  const [xIsNext, setXisNext] = useState(true)
  const [coordinates, setCoordinates] = useState([{col: 0, row: 0}])
  const [isReversed, setIsReversed] = useState(false)
  function handleClick(i: number) {
    const current = history[stepNumber];
    const squares = current.squares.slice();
    let y: number, x: number
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';

    y = (i%3)+1
    x = (Math.floor(i/3)+1)
    setHistory(history.concat([{
      squares: squares,
    }]))
    setStepNumber(history.length)
    setXisNext(!xIsNext)
    setCoordinates(([{
      col: y,
      row: x,
    }]))

    // this.setState({
    //   history: history.concat([{
    //     squares: squares,
    //   }]),
    //   stepNumber: history.length,
    //   xIsNext: !this.state.xIsNext,
    //   coordinates : ([{
    //     col: y,
    //     row: x,
    //   }])
    // });
  }

  function jumpTo(step: number) {
    // this.setState({
    //   stepNumber: step,
    //   xIsNext: (step % 2) === 0,
    // });

    setStepNumber(step)
    setXisNext((step % 2) === 0,)

  }

    const historySliced = history.slice(0, stepNumber + 1);
    const current = historySliced[historySliced.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = historySliced.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button  style={ move==stepNumber ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}  onClick={() => jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner?.letter) {
      status = 'Winner: ' + winner.letter;
    } 
    // else if(!current.squares.some((elem) => elem === null)){
    //   status = 'Tie'
    // }
    else {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
    useEffect(() => {
      if(!current.squares.some((elem) => elem === null)){
        alert('Tie')
      }
    },[current.squares])
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winner={winner}
            onClick={(i) => handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div><button onClick={() => setIsReversed(!isReversed)}>Reverse history</button></div>
          <ol>{isReversed ? moves.reverse() : moves}</ol>
          {(stepNumber > 0) && <ol>{JSON.stringify(coordinates)}</ol>}
        </div>
      </div>
    );
  
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
