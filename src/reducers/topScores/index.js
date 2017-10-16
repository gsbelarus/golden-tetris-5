import update from 'immutability-helper'
import store from '../../store'
import * as reducerType from '../../unit/reducerType'
import { lastRecord, storageKey } from '../../unit/const'

const topScores = (state = {
    show: false,
    askName: false,
    data: lastRecord ? lastRecord : {top10: [], lastName: ''}
  }, action) => {
  switch (action.type) {
    case reducerType.TS_SHOW:
      return {...state, show: true}

    case reducerType.TS_CLOSE:
      if (action.erase) {
        return {...state, show: false, data: {...state.data, top10: []}}
      } else {
        return {...state, show: false}
      }

    case reducerType.TS_CLOSE_ASK_NAME: {
      if (action.date !== undefined && action.duration !== undefined && !isNaN(action.duration)) {
        const newTop10 = update(state.data.top10,
          {$push:
            [
              {
                name: action.playerName,
                date: action.date,
                score: action.score,
                lines: action.lines,
                duration: action.duration
              }
            ]
          })

        const newData = {
          top10: newTop10.sort( (a, b) => b.score - a.score ).slice(0, 9),
          lastName: action.playerName
        }

        localStorage.setItem(storageKey, JSON.stringify(newData))

        return {
          show: true,
          askName: false,
          data: newData
        }
      } else {
        return {...state, askName: false}
      }
    }

    case reducerType.GAME_STOP:
      if (!action.aborted) {
        const points = store.getState().points

        if (state.data.top10.length < 10 || state.data.top10.some( (i) => i < points )) {
          return {...state, askName: true}
        } else {
          return state
        }
      } else {
        return state
      }

    default:
      return state
  }
}

export default topScores