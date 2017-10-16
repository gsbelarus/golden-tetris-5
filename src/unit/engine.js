import update from 'immutability-helper'
import store from './../store'
import { gameStageEnum } from './const.js'
import { stopGame, setNewFigure, mergeGame, moveGame, burnRows, gameEndAnimation } from './../actions'

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export default function gameEngine(dispatch) {

  const { gameStage, figure, w, cells, timerID, nextFigure } = store.getState().tetris

  if (gameStage !== gameStageEnum.inProgress) {
    return
  }

  if (figure === undefined) {

    const fullRows = cells.reduce( (fr, r, idx) => r.every( c => c ) ? fr.concat(idx) : fr, [])

    if (fullRows.length) {
      dispatch(burnRows(fullRows, cells, false))
      wait(800).then(() => dispatch(gameEndAnimation()))
    } else {
      const newFigure = update(nextFigure,
        {x: {$set: (w - nextFigure.getWidth()) / 2 >> 0}, y: {$set: 0}})
      if (newFigure.canMove(0, 0, false, cells)) {
        dispatch(setNewFigure(newFigure))
      } else {
        Promise.all(cells.map( (r, i) =>
          wait(280 * i).then( () => dispatch(burnRows([i], cells, true))) )
        ).then(wait(400)).then( () => dispatch(stopGame(timerID, false)))
      }
    }
  } else {
    if (figure.canMove(0, 1, false, cells)) {
      dispatch(moveGame(0, 1, false))
    } else {
      dispatch(mergeGame())
    }
  }
}