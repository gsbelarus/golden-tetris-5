import * as reducerType from '../unit/reducerType.js'
import gameEngine from './../unit/engine.js'
import { getRandomFigure } from './../unit/figures.js'
import { levelDelay, maxLevel, minimalDelay } from './../unit/const.js'

function calcDelay(level) {
  return minimalDelay + levelDelay * (maxLevel - level)
}

export function pauseGame() {
  return {
    type: reducerType.GAME_PAUSE
  }
}

export function resumeGame() {
  return {
    type: reducerType.GAME_RESUME
  }
}

export function stopGame(timerID, aborted) {
  clearInterval(timerID)
  return {
    type: reducerType.GAME_STOP,
    aborted
  }
}

export function startGame(dispatch, level) {
  return {
    type: reducerType.GAME_START,
    timerID: setInterval( () => gameEngine(dispatch), calcDelay(level) )
  }
}


export function setNewFigure(figure) {
  return {
    type: reducerType.GAME_NEWFIGURE,
    figure,
    nextFigure: getRandomFigure()
  }
}

export function mergeGame() {
  return {
    type: reducerType.GAME_MERGE
  }
}

export function moveGame(dx, dy, turn) {
  return {
    type: reducerType.GAME_MOVE,
    dx,
    dy,
    turn
  }
}

export function burnRows(fullRows, cells, finalBurn) {
  return {
    type: reducerType.GAME_BURNROWS,
    fullRows,
    cells,
    finalBurn
  }
}

export function gameEndAnimation() {
  return {
    type: reducerType.GAME_ENDANIMATION
  }
}

export function nextPiece() {
  return {
    type: reducerType.UI_NEXT_PIECE
  }
}

export function showLevel() {
  return {
    type: reducerType.UI_SHOW_LEVEL
  }
}

export function showPoints() {
  return {
    type: reducerType.UI_SHOW_POINTS
  }
}

export function showLines() {
  return {
    type: reducerType.UI_SHOW_LINES
  }
}

export function showFigures() {
  return {
    type: reducerType.UI_SHOW_FIGURES
  }
}

export function setLevel(dispatch, level, prevTimerID) {
  var timerID = 0
  if (prevTimerID) {
    clearInterval(prevTimerID)
    timerID = setInterval( () => gameEngine(dispatch), calcDelay(level) )
  }
  return {
    type: reducerType.GAME_SET_LEVEL,
    level,
    timerID
  }
}

export function closeAskName(isOk, playerName, score, lines, date, duration) {
  return {
    type: reducerType.TS_CLOSE_ASK_NAME,
    isOk,
    playerName,
    score,
    lines,
    date,
    duration
  }
}

export function showTS() {
  return {
    type: reducerType.TS_SHOW
  }
}

export function closeTS(erase) {
  return {
    type: reducerType.TS_CLOSE,
    erase
  }
}