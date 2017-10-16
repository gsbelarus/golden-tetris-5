import * as reducerType from '../../unit/reducerType'
import { maxPoint, burnRowsPoints } from '../../unit/const'

const points = (state = 0, action) => {
  switch (action.type) {
    case reducerType.GAME_MOVE:
      if (action.dx || action.turn) {
        const turnPoints = state - 1
        return turnPoints > 0 ? turnPoints : 0
      } else {
        return state
      }
    case reducerType.GAME_BURNROWS: {
      let rowPoints
      if (action.finalBurn) {
        rowPoints = state + action.cells[action.fullRows[0]].reduce(
          (p, c) => c ? p + 1 : p, 0 )
      } else {
        rowPoints = state + burnRowsPoints[action.fullRows.length - 1]
      }
      return rowPoints > maxPoint ? maxPoint : rowPoints
    }
    case reducerType.GAME_NEWFIGURE: {
      const figurePoints = state + action.figure.points
      return figurePoints > maxPoint ? maxPoint : figurePoints
    }
    case reducerType.GAME_START:
      return 0
    default:
      return state
  }
}

export default points