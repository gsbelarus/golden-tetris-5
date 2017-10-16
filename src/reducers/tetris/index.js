import { gameStageEnum } from '../../unit/const.js'
import update from 'immutability-helper'
import { getRandomFigure } from '../../unit/figures.js'
import * as reducerType from '../../unit/reducerType'

function createWell(w, h, c = 0) {
  const cells = []

  for (let y = 0; y < h; y++) {
    cells[y] = []
    for (let x = 0; x < w; x++) {
      cells[y][x] = c
    }
  }

  return cells
}

function deleteFullRows(cells, w, h, fullRows) {
  const newCells = cells.filter( (r, idx) => !fullRows.includes(idx) )
  while (newCells.length < h) {
    const newRow = []
    for (let i = 0; i < w; i++) {
      newRow[i] = 0
    }
    newCells.splice(0, 0, newRow)
  }
  return newCells
}

function getDefaultState() {
  const w = 10
  const h = 20

  return {
    gameStage: gameStageEnum.ready,
    w,
    h,
    cells: createWell(w, h, 11),
    timerID: 0,
    figure: undefined,
    fullRows: [],
    nextCells: createWell(5, 4, 11),
    nextFigure: undefined,
    gameStarted: undefined,
    gameEnded: undefined
  }
}

function tetris(state = getDefaultState(), action)
{
  switch (action.type) {
    case reducerType.GAME_START:
      if (state.gameStage === gameStageEnum.ready) {
        return update(state, {$merge:
          {
            gameStage: gameStageEnum.inProgress,
            timerID: action.timerID,
            cells: createWell(state.w, state.h, 0),
            nextCells: createWell(5, 4, 0),
            nextFigure: getRandomFigure(),
            gameStarted: new Date(),
            gameEnded: undefined
          }})
      } else {
        return state
      }
    case reducerType.GAME_STOP:
      if (state.gameStage !== gameStageEnum.ready) {
        return update(state, {$merge:
          {
            gameStage: gameStageEnum.ready,
            timerID: 0,
            cells: createWell(state.w, state.h, 11),
            fullRows: [],
            figure: undefined,
            nextCells: createWell(5, 4, 11),
            nextFigure: undefined,
            gameEnded: new Date()
          }})
      } else {
        return state
      }
    case reducerType.GAME_PAUSE:
      if (state.gameStage === gameStageEnum.inProgress) {
        return update(state, {$merge: {gameStage: gameStageEnum.paused}})
      } else {
        return state
      }
    case reducerType.GAME_RESUME:
      if (state.gameStage === gameStageEnum.paused) {
        return update(state, {$merge: {gameStage: gameStageEnum.inProgress}})
      } else {
        return state
      }
    case reducerType.GAME_NEWFIGURE: {
      const nextFigure = update(action.nextFigure, {
        x: {$set: (5 - action.nextFigure.getWidth()) / 2 >> 0 },
        y: {$set: (4 - action.nextFigure.getHeight()) / 2 >> 0 }
      })
      return update(state, {
        figure: {$set: action.figure},
        nextFigure: {$set: nextFigure}
      })
    }
    case reducerType.GAME_MOVE:
      if (state.figure.canMove(action.dx, action.dy, action.turn, state.cells)) {
        return update(state, {
          figure: {$merge: {
            x: state.figure.x + action.dx,
            y: state.figure.y + action.dy,
            o: action.turn ? state.figure.nextO() : state.figure.o
          }}
        })
      } else {
        return state
      }
    case reducerType.GAME_MERGE:
      return update(state, {cells: {$set: state.figure.merge(state.cells)}, figure: {$set: undefined}})
    case reducerType.GAME_BURNROWS:
      return update(state, {
        fullRows: {$set: state.fullRows.concat(action.fullRows)},
        gameStage: {$set: gameStageEnum.inAnimation}
      })
    case reducerType.GAME_ENDANIMATION:
      return update(state, {
        cells: {$set: deleteFullRows(state.cells, state.w, state.h, state.fullRows)},
        fullRows: {$set: []},
        gameStage: {$set: gameStageEnum.inProgress}
      })
    case reducerType.GAME_SET_LEVEL:
      if (action.timerID) {
        return update(state, {$merge: { timerID: action.timerID }})
      } else {
        return state
      }
    default:
      return state
  }
}

export default tetris