import React from 'react';
import ReactDOM from 'react-dom';
import './MatchingGame.css'; // Import the CSS file

class PlayGround extends React.Component {
  state = {
    frameworks: [
     'https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/CTA%2Fmemory-game%2Fmg1.png?alt=media&token=80f5575e-65fe-429e-a5d2-9635312073d8',
     'https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/CTA%2Fmemory-game%2Fmg2.png?alt=media&token=8664d9b8-86e3-453d-953f-77d68e611340'
     ,'https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/CTA%2Fmemory-game%2Fmg3.png?alt=media&token=bc3a5e49-2741-4c07-a13b-9a942d0fe5e1',
     'https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/CTA%2Fmemory-game%2Fmg4.png?alt=media&token=31a33303-2176-4a39-a139-8ff1aaeba7ec',
     'https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/CTA%2Fmemory-game%2Fmg5.png?alt=media&token=ffa52dc4-25e6-4c9d-9f6f-c749b6812624',
     'https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/CTA%2Fmemory-game%2Fmg6.png?alt=media&token=a6751e7a-dc7f-4bb0-9692-5575d131da06',
     'https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/CTA%2Fmemory-game%2Fmg7.png?alt=media&token=8e072ed8-3022-408b-b6fd-3cab5a68e124',
     'https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/CTA%2Fmemory-game%2Fmg8.png?alt=media&token=88ecf9a4-3cb9-45e0-8fd6-2ec23aaee92c'
      
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
  
    this.setState(
      {
        openedFrameworks: frameworks,
        finalizedFrameworks: finalizedFrameworks,
      },
      () => {
        if (frameworks.length === 2) {
          this.setState(
            (prevState) => ({ moves: prevState.moves - 1 }), // Decrement moves
            () => {
              if (this.state.moves <= 0) {
                this.endGame(); // End game if moves reach zero
              }
            }
          );
          setTimeout(() => {
            this.check();
          }, 1000);
        } else {
          setTimeout(() => {
            this.check();
          }, 1500);
        }
      }
    );
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
    const maxMoves = Math.floor((uniqueComponents * (2 * uniqueComponents - 1)) / 1.5);
    this.setState({ finalizedFrameworks, moves: maxMoves, timer: 120, gameOver: false, maxMoves });
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
    this.setState({ gameOver: true }, () => {
      const gameData = {
        moves: this.state.moves,
        timeLeft: this.state.timer,
        result: won ? 'won' : 'lost'
      };
      this.props.onGameEnd(gameData);
    });
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
                 this.props.framework 
              }
              alt={"card"}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default PlayGround;