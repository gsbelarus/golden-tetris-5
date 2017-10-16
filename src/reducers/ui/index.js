import * as reducerType from '../../unit/reducerType'

const ui = (state =
  {
    nextPiece: true,
    showLevel: true,
    showPoints: true,
    showFigures: true,
    showLines: true,
  }, action) =>
{
  switch (action.type) {
    case reducerType.UI_NEXT_PIECE:
      return { ...state, nextPiece: !state.nextPiece }
    case reducerType.UI_SHOW_LEVEL:
      return { ...state, showLevel: !state.showLevel }
    case reducerType.UI_SHOW_POINTS:
      return { ...state, showPoints: !state.showPoints }
    case reducerType.UI_SHOW_FIGURES:
      return { ...state, showFigures: !state.showFigures }
    case reducerType.UI_SHOW_LINES:
      return { ...state, showLines: !state.showLines }
    default:
      return state
  }
}

export default ui