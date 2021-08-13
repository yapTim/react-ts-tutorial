import React from 'react';
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

interface BoardState{squares: Array<any>, xIsNext: Boolean}
interface BoardProp{squares: Array<any>, onClick: (i: number) => void, winner: {letter: string, lines: number[]} | null}
class Board extends React.Component<BoardProp,BoardState> {
  renderSquare(i: number) {
    return <Square 
      value={this.props.squares[i]} 
      onClick={() => this.props.onClick(i)}
      inLines={this.props.winner?.lines.includes(i) || false}  
    />;
  }
  loopSquare(){
    let squareArray = []
    let rowArray = []
    for (let i = 0 ;i<9; i++){
      squareArray.push(this.renderSquare(i))
    }

    for(let row=0; row<3; row++){
        rowArray.push(<div className="board-row">{squareArray.slice((row*3), (row*3)+3)}</div>)    
    }

    // for(let row=0; row<3; row++){
    //   let squareArray = []
    //   for (let i = row*3 ; i<(row*3)+3; i++){
    //     squareArray.push(this.renderSquare(i))
    //   }
    //   rowArray.push(<div className="board-row">{squareArray}</div>)
    // }

    return rowArray
   
  }
  

  render() {
    return (
      <div>
          {this.loopSquare()}
      </div>
    );
  }
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

interface GameState{xIsNext: Boolean, history: Array<any>, stepNumber: number, coordinates: Array<any>}
class Game extends React.Component<{}, GameState> {
  constructor(props: {}){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      coordinates: [{
        col: 0,
        row: 0,
      }]
    }
  }

  handleClick(i: number) {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    const coordinates = this.state.coordinates
    let y: number, x: number
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    y = (i%3)+1
    x = (Math.floor(i/3)+1)
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      coordinates : ([{
        col: y,
        row: x,
      }])
    });
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }


  render() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button  style={ move==this.state.stepNumber ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}  onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner?.letter) {
      status = 'Winner: ' + winner.letter;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winner={winner}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <ol>{JSON.stringify(this.state.coordinates)}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
