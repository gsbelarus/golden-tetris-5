import * as reducerType from '../../unit/reducerType'

const figures = (state = 0, action) => {
  switch (action.type) {
    case reducerType.GAME_NEWFIGURE:
      return state + 1
    case reducerType.GAME_START:
      return 0
    default:
      return state
  }
}

export default figures