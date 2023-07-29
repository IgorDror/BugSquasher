import './App.sass'
import useGame, { gameStatuses } from './hooks/game.js'
import { ONE_SECOND } from './system/constants/timeUnits.js'
import { useRef } from 'react'

const ACTION_WIDTH = 100
const ACTION_HEIGHT = 100
const ACTION_CLASSNAME = 'game__action'
const ACTION_CONFIG = {
  width: ACTION_WIDTH,
  height: ACTION_HEIGHT,
  className: ACTION_CLASSNAME
}

function App () {

  const gameField = useRef(null)
  const { score, gameStatus, estimatedTime, startGame, resetGame } = useGame({ duration: 60000 })
  const gameScore = () => {
    return <p className="game__score">Score: {score}</p>
  }

  const newGameButton = () => {
    return <button
      onClick={() => startGame({
        actionConfig: ACTION_CONFIG, container: gameField?.current
      })}
      className="game__button"
    >
      New game
    </button>
  }

  const timer = () => {
    return <p className="game__timer">{estimatedTime / ONE_SECOND}s</p>
  }

  const newGameConfig = () => {
    return {
      gameButton: newGameButton
    }
  }

  const information = () => {
    return <div>
      <p>GAME OVER!</p>
      <p>You fixed { score } bugs.</p>
    </div>
  }

  const activeGameConfig = () => {
    return {
      timer,
      gameScore
    }
  }

  const endGameConfig = () => {
    return {
      gameButton: endGameButton,
      main: information
    }
  }

  const endGameButton = () => {
    return <button
      onClick={resetGame}
      className="game__button"
    >Reset game</button>
  }

  const gameConfig = () => {
    const config = {
      [gameStatuses.idle]: newGameConfig,
      [gameStatuses.active]: activeGameConfig,
      [gameStatuses.gameOver]: endGameConfig
    }
    return config[gameStatus]()
  }

  return (
    <div className="app">
      <main className="app__game-container">
        <div className="game">
          <div>
            {gameConfig().gameScore?.()}
            {gameConfig().timer?.()}
          </div>
          {gameConfig().gameButton?.()}
          <div
            className="game__field"
            ref={gameField}
          >
            {gameConfig().main?.()}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
