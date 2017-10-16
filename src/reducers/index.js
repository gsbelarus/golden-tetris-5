import { combineReducers } from 'redux'
import points from './points'
import tetris from './tetris'
import level from './level'
import ui from './ui'
import lines from './lines'
import figures from './figures'
import topScores from './topScores'

const rootReducer = combineReducers({
  tetris,
  points,
  level,
  ui,
  lines,
  figures,
  topScores
})

export default rootReducer
