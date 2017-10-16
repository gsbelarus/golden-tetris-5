import * as reducerType from '../../unit/reducerType'

const lines = (state = 0, action) => {
  switch (action.type) {
    case reducerType.GAME_BURNROWS:
      return state + action.fullRows.length
    case reducerType.GAME_START:
      return 0
    default:
      return state
  }
}

export default lines