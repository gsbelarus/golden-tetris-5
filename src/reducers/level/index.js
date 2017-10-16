import store from '../../store'
import * as reducerType from '../../unit/reducerType'
import { minLevel, maxLevel, defLevel, pointsPerLevel } from '../../unit/const'

const level = (state = defLevel, action) => {
  switch (action.type) {
    case reducerType.GAME_INC_LEVEL:
      if (state < maxLevel) {
        return state + 1
      } else {
        return state
      }
    case reducerType.GAME_DEC_LEVEL:
      if (state > minLevel) {
        return state - 1
      } else {
        return state
      }
    case reducerType.GAME_SET_LEVEL:
      if (action.level >= minLevel && action.level <= maxLevel) {
        return action.level
      } else {
        return state
      }
    case reducerType.GAME_BURNROWS: {
      if (state < maxLevel) {
        const points = store.getState().points
        if (points > (state + 1) * pointsPerLevel) {
          return state + 1
        } else {
          return state
        }
      } else {
        return state
      }
    }
    default:
      return state
  }
}

export default level