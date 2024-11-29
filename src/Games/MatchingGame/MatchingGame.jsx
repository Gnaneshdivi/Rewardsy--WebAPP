import React from 'react';
import ReactDOM from 'react-dom';
import './MatchingGame.css'; // Import the CSS file

class PlayGround extends React.Component {
  state = {
    frameworks: [
      'angular2', 'vue', 'react', 'grunt', 'phantomjs', 'ember', 'babel', 'ionic',
      
    ],
    duplicatedFrameworks: [],
    randomizedFrameworks: [],
    finalizedFrameworks: [],
    openedFrameworks: [],
    moves: 0,
    timer: 120, // Timer in seconds
    gameOver: false,
    maxMoves: 0
  };

  componentDidMount() {
    this.start();
    this.startTimer();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.state.timer > 0 && !this.state.gameOver) {
        this.setState(prevState => ({ timer: prevState.timer - 1 }));
      } else {
        this.endGame();
      }
    }, 1000);
  }

  handleClick(name, index) {
    if (this.state.openedFrameworks.length === 2 || this.state.finalizedFrameworks[index].complete || this.state.gameOver) {
      return;
    }
    let framework = { name, index };
    let finalizedFrameworks = [...this.state.finalizedFrameworks];
    let frameworks = [...this.state.openedFrameworks];
    finalizedFrameworks[index].close = false;
    frameworks.push(framework);
    this.setState({
      openedFrameworks: frameworks,
      finalizedFrameworks: finalizedFrameworks
    }, () => {
      if (frameworks.length === 2) {
        this.setState(prevState => ({ moves: prevState.moves + 1 }), () => {
          if (this.state.moves >= this.state.maxMoves) {
            this.endGame();
          }
        });
        setTimeout(() => {
          this.check();
        }, 1000);
      } else {
        setTimeout(() => {
          this.check();
        }, 1500);
      }
    });
  }

  check() {
    let finalizedFrameworks = [...this.state.finalizedFrameworks];
    if (
      this.state.openedFrameworks.length === 2 &&
      this.state.openedFrameworks[0].name === this.state.openedFrameworks[1].name &&
      this.state.openedFrameworks[0].index !== this.state.openedFrameworks[1].index
    ) {
      finalizedFrameworks[this.state.openedFrameworks[0].index].complete = true;
      finalizedFrameworks[this.state.openedFrameworks[1].index].complete = true;
    } else {
      if (this.state.openedFrameworks.length === 1 || this.state.openedFrameworks.length === 2) {
        finalizedFrameworks[this.state.openedFrameworks[0].index].close = true;
        if (this.state.openedFrameworks.length === 2) {
          finalizedFrameworks[this.state.openedFrameworks[1].index].close = true;
        }
      }
    }
    this.setState({
      finalizedFrameworks,
      openedFrameworks: []
    }, () => {
      if (this.state.finalizedFrameworks.every(card => card.complete)) {
        this.endGame(true);
      }
    });
  }

  start() {
    let finalizedFrameworks = [];
    const duplicatedFrameworks = this.state.frameworks.concat(this.state.frameworks);
    const randomizedFrameworks = this.shuffle(duplicatedFrameworks);
    randomizedFrameworks.forEach((name, index) => {
      finalizedFrameworks.push({
        name,
        close: true,
        complete: false
      });
    });
    const uniqueComponents = this.state.frameworks.length;
    const maxMoves = uniqueComponents * (2 * uniqueComponents - 1); // Maximum moves equation
    this.setState({ finalizedFrameworks, moves: 0, timer: 120, gameOver: false, maxMoves });
  }

  shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  endGame(won = false) {
    clearInterval(this.timerInterval);
    this.setState({ gameOver: true });
    if (won) {
      alert(`Congratulations! You won in ${this.state.moves} moves!`);
    } else {
      alert('Time is up or maximum moves reached! Game over.');
    }
  }

  render() {
    return (
      <div className="playground-container">
        <div className="game-info">
          <div className="moves-info">
            <p>Moves: {this.state.moves}</p>
          </div>
          <div className={`timer-info ${this.state.timer < 30 ? 'timer-warning' : ''}`}>
            <p>Time Left: {this.state.timer}s</p>
          </div>
        </div>
        <div className="playground">
          {this.state.finalizedFrameworks.map((framework, index) => {
            return (
              <Card
                key={index}
                framework={framework.name}
                click={() => {
                  this.handleClick(framework.name, index);
                }}
                close={framework.close}
                complete={framework.complete}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

class Card extends React.Component {
  clicked(framework) {
    this.props.click(framework);
  }

  render() {
    return (
      <div
        className={
          "card" +
          (!this.props.close ? ' opened' : '') +
          (this.props.complete ? ' matched' : '')
        }
        onClick={() => this.clicked(this.props.framework)}
      >
        <div className="front">?</div>
        <div className="back">
          {!this.props.close || this.props.complete ? (
            <img
              src={
                "https://raw.githubusercontent.com/samiheikki/javascript-guessing-game/master/static/logos/" +
                this.props.framework +
                ".png"
              }
              alt={this.props.framework}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default PlayGround;