import React, { Component } from 'react';

class PlayBoard extends Component {
  constructor(props) {
    super(props);
    this.state = this.getState();
    this.takeTurn = this.takeTurn.bind(this);
  }

  getState() {
    const score = this.state ? this.state.score : [0, 0];
    return {
      turn: 0,
      x: [],
      o: [],
      score,
      gameOver: false,
      combo: [],
      availableNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      board: [8, 1, 6, 3, 5, 7, 4, 9, 2]
    };
  }

  getChar(el) {
    if (this.state.x.indexOf(el) !== -1) {
      return 'x';
    } else if (this.state.o.indexOf(el) !== -1) {
      return 'o';
    } else {
      return '';
    }
  }

  getScore() {
    return (
      <h1 className="score">
        <span>you</span>: {this.state.score[0]} <span>me</span>:{' '}
        {this.state.score[1]}
      </h1>
    );
  }

  getMessage() {
    if (!this.state.gameOver) {
      return (
        <h1>
          It's <span>{this.state.turn === 0 ? 'your' : 'my'}</span> turn
        </h1>
      );
    } else if (this.state.gameOver && this.state.combo.length > 0) {
      const sum = this.state.combo.join(' + ') + ' = 15';
      return (
        <h1>
          Game over, <span>{this.state.whoWon === 0 ? 'you' : 'I'}</span> won ({sum})
        </h1>
      );
    } else {
      return (
        <h1>
          Its a <span>draw</span>
        </h1>
      );
    }
  }

  render() {
    return (
      <div>
        {this.getMessage()}
        {this.getScore()}
        <div className="board">
          {this.state.board.map((el, index) => {
            return (
              <Square
                key={el}
                winner={this.state.combo.indexOf(el) !== -1}
                id={el}
                char={this.getChar(el)}
                onClick={this.takeTurn}
              />
            );
          })}
        </div>
        <div
          className="reset"
          onClick={() => {
            this.reset();
          }}
        >
          Reset
        </div>
      </div>
    );
  }

  reset() {
    this.setState(this.getState());
  }

  getAiTurn() {
    let index = -1,
      i,
      arr;
    const available = this.state.availableNumbers,
      o = this.state.o.slice(0),
      x = this.state.x.slice(0);

    // check for possible win
    for (i = 0; i < available.length; i++) {
      arr = o.slice(0);
      arr.push(available[i]);
      if (this.hasWon(arr)) {
        return available[i];
      }
    }
    // check to see if we can stop them winning
    for (i = 0; i < available.length; i++) {
      arr = x.slice(0);
      arr.push(available[i]);
      if (this.hasWon(arr)) {
        return available[i];
      }
    }
    // get random
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }
    return index;
  }

  takeTurn(id) {
    if (this.state.gameOver === true || this.state.turn === 1) {
      return false;
    }
    this.place(id, 'x');
    if (!this.state.gameOver) {
      this.setState({ turn: 1 });
      setTimeout(() => {
        this.place(this.getAiTurn(), 'o');
        this.setState({ turn: 0 });
      }, 500);
    }
  }

  place(id, char) {
    const { turn, availableNumbers, x, o } = this.state,
      index = availableNumbers.indexOf(id);
    if (this.state.gameOver) {
      return false;
    }
    if (index !== -1) {
      var current = turn === 1 ? o : x;
      availableNumbers.splice(index, 1);
      current.push(id);
      this.setState({ availableNumbers, x, o });
    }
    this.checkGame();
  }
  checkGame() {
    const state = {};
    // add copies of current game board
    state.x = this.state.x.slice(0);
    state.o = this.state.o.slice(0);
    // check for game over / winner
    var win = this.hasWon(this.state.x) || this.hasWon(this.state.o);
    if (win) {
      state.gameOver = true;
      state.combo = win;
      state.whoWon = this.state.turn;
      state.score = this.state.score;
      state.score[this.state.turn] = ++this.state.score[this.state.turn];
    } else {
      state.gameOver = this.state.availableNumbers.length === 0;
    }
    // if game not over, add who goes next
    if (!state.gameOver) {
      state.next = this.state.x.length > this.state.o.length ? 'o' : 'x';
    }
    this.setState(state);
  }

  hasWon(player) {
    for (var i = 0; i < player.length; i++) {
      for (var j = i + 1; j < player.length; j++) {
        for (var k = j + 1; k < player.length; k++) {
          if (player[i] + player[j] + player[k] === 15) {
            return [player[i], player[j], player[k]];
          }
        }
      }
    }
    return false;
  }
}

function Square(props) {
  const classes = ['square'];
  if (props.char !== '') {
    classes.push(props.char === 'x' ? 'cross' : 'circle');
    if (props.winner) {
      classes.push('winner');
    }
  }

  return (
    <div
      onClick={() => {
        props.onClick(props.id);
      }}
      className={classes.join(' ')}
    >
      <svg className="cross" viewBox="0 0 512 512">
        <path d="M256.010 204.645l100.118-100.146 51.344 51.33-100.118 100.146-51.344-51.329z" />
        <path d="M155.827 407.483l-51.344-51.358 100.161-100.132 51.344 51.358-100.161 100.132z" />
        <path d="M407.498 356.112l-51.373 51.358-100.118-100.146 51.373-51.358 100.118 100.146z" />
        <path d="M104.502 155.857l51.337-51.351 100.153 100.125-51.337 51.351-100.153-100.125z" />
        <path d="M255.983 307.36l-51.351-51.365 51.365-51.351 51.351 51.365-51.365 51.351z" />
      </svg>
      <svg className="circle" viewBox="0 0 500 500">
        <circle cx="250" cy="250" r="135" fill="none" />
      </svg>
      {props.id}
    </div>
  );
}
export default PlayBoard;
