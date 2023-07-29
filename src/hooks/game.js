import { useState } from 'react'
import { ONE_SECOND } from '../system/constants/timeUnits'

export const gameStatuses = {
  idle: 'idle',
  active: 'active',
  gameOver: 'gameOver'
}

const useGame = ({ duration }) => {
  let estimatedIntervalId

  const [score, setScore] = useState(0)
  const [gameStatus, setGameStatus] = useState(gameStatuses.idle)
  const [estimatedTime, setEstimatedTime] = useState(duration)

  const startGame = ({ container, actionConfig }) => {
    setEstimatedTime(duration)
    setScore(0)
    setGameStatus(gameStatuses.active)
    estimatedIntervalId = setInterval(() => {
      setEstimatedTime(time => time - ONE_SECOND)
    }, ONE_SECOND)
    setTimeout(() => endGame(container), duration)
    generateAction({ actionConfig, container })
  }

  const endGame = (container) => {
    container.innerHTML = null
    clearInterval(estimatedIntervalId)
    setGameStatus(gameStatuses.gameOver)
  }

  const resetGame = () => {
    setGameStatus(gameStatuses.idle)
  }

  const handleActionClick = (config) => {
    setScore(score => score + 1)
    generateAction(config)
  }

  const randomInteger = (min, max) => {
    const rand = min - 0.5 + Math.random() * (max - min + 1)
    return Math.round(rand)
  }

  const getRandomPosition = (max, min, current, step) => {
    const direction = Math.random() > 0.5 ? 1 : -1

    let position = current + (direction * step)

    if (position < min) {
      return min
    }
    if (position > max) {
      return max
    }
    return position
  }

  const makeActionMoveRandomly = ({ action, container, height, width }) => {
    action.style.top = getRandomPosition(container.offsetHeight - height, height, parseInt(action.style.top), 30) + 'px'
    action.style.left = getRandomPosition(container.offsetWidth - width, width, parseInt(action.style.left), 30) + 'px'
  }

  const generateAction = ({ actionConfig, container }) => {
    const dx = randomInteger(0, container.offsetWidth - actionConfig.width)
    const dy = randomInteger(0, container.offsetHeight - actionConfig.height)
    const action = document.createElement('button')
    action.style.position = 'relative'
    action.style.top = dy + 'px'
    action.style.left = dx + 'px'
    action.classList.add(actionConfig.className)

    const actionMoveInterval = setInterval(() => {
      makeActionMoveRandomly({ action, container, height: actionConfig.height, width: actionConfig.width })
    }, ONE_SECOND / 10)
    action.onclick = () => {
      clearInterval(actionMoveInterval)
      handleActionClick({ actionConfig, container })
    }
    container.innerHTML = ''
    container.appendChild(action)
  }

  return {
    score,
    setScore,
    gameStatus,
    estimatedTime,
    startGame,
    resetGame
  }
}

export default useGame
