import React from 'react'
import propTypes from 'prop-types'
import './index.css'
import Well from './../components/well'
import { connect } from 'react-redux'
import LCDLabel from './../components/lcdLabel'
import WindowCaption from './../components/windowCaption'
import WindowMenu from './../components/windowMenu'
import store from './../store'
import { gameStageEnum, levels } from './../unit/const.js'
import { pauseGame, resumeGame, startGame, stopGame,
  nextPiece, showLevel, showPoints, showLines, showFigures,
  setLevel, closeAskName, showTS, closeTS } from './../actions'
import gameEngine from './../unit/engine.js'
import KeyHandler, { KEYDOWN, KEYPRESS } from 'react-key-handler'
import TopScoresBox from './../components/topScoresBox'
import InputBox from './../components/inputBox'
import Draggable from 'react-draggable'

const GameWell = connect(
  state => (
    {
      w: state.tetris.w,
      h: state.tetris.h,
      getCellColor: (x, y) => {
        const { fullRows, figure, cells } = state.tetris
        if (fullRows.includes(y)) {
          return cells[y][x] ? 100 : 0
        } else if (figure === undefined) {
          return cells[y][x]
        } else {
          return figure.getCellColor(x, y, cells[y][x])
        }
      },
      visible: true,
      paused: state.tetris.gameStage === gameStageEnum.paused
    }
  )
)(Well)

const NextWell = connect(
  state => (
    {
      w: 4,
      h: 4,
      getCellColor: (x, y) => {
        const { figure, nextFigure, nextCells } = state.tetris
        if (figure === undefined) {
          return nextCells[y][x]
        } else {
          return nextFigure.getCellColor(x, y, nextCells[y][x])
        }
      },
      visible: state.ui.nextPiece,
      paused: state.tetris.gameStage === gameStageEnum.paused
    }
  )
)(Well)

class App extends React.Component {

  constructor(props) {
    super(props)

    this.processKeyEvent = this.processKeyEvent.bind(this)
    this.execAction = this.execKeyAction.bind(this)
    this.onCloseAskNameDlg = this.onCloseAskNameDlg.bind(this)
    this.onClickCloseTS = this.onClickCloseTS.bind(this)

    this.actions = {
      newGame: {
        id: 10010,
        caption: 'New',
        keyValue: 'F2',
        enabled: () => this.props.gameStage === gameStageEnum.ready,
        checked: false,
        exec: () => {
          const { dispatch, level } = this.props
          dispatch(startGame(dispatch, level))
        }
      },
      abortGame: {
        id: 10020,
        caption: 'Abort',
        keyValue: 'Escape',
        enabled: () => this.props.gameStage === gameStageEnum.inProgress || this.props.gameStage === gameStageEnum.paused,
        checked: false,
        exec: () => {
          const { dispatch, timerID } = this.props
          dispatch(stopGame(timerID, true))
        }
      },
      pauseGame: {
        id: 10030,
        caption: () => this.props.gameStage === gameStageEnum.paused ? 'Resume' : 'Pause',
        keyValue: 'Pause',
        enabled: () => this.props.gameStage === gameStageEnum.inProgress || this.props.gameStage === gameStageEnum.paused,
        checked: false,
        exec: () => {
          const { gameStage, dispatch } = this.props
          if (gameStage === gameStageEnum.inProgress) {
            dispatch(pauseGame())
          } else {
            dispatch(resumeGame())
          }
        }
      },
      topScores: {
        id: 10050,
        caption: 'Top scores...',
        keyValue: 'F9',
        enabled: () => this.props.gameStage === gameStageEnum.ready,
        checked: false,
        exec: () => {
          const { dispatch } = this.props
          dispatch(showTS())
        }
      },
      nextPiece: {
        id: 20010,
        caption: 'Next piece',
        keyValue: 'F3',
        enabled: true,
        checked: () => this.props.nextPiece,
        exec: () => {
          const { dispatch } = this.props
          dispatch(nextPiece())
        }
      },
      showLevel: {
        id: 20050,
        caption: 'Level',
        keyValue: 'F7',
        enabled: true,
        checked: () => this.props.showLevel,
        exec: () => {
          const { dispatch } = this.props
          dispatch(showLevel())
        }
      },
      showPoints: {
        id: 20020,
        caption: 'Score',
        keyValue: 'F4',
        enabled: true,
        checked: () => this.props.showPoints,
        exec: () => {
          const { dispatch } = this.props
          dispatch(showPoints())
        }
      },
      showLines: {
        id: 20030,
        caption: 'Lines',
        keyValue: 'F5',
        enabled: true,
        checked: () => this.props.showLines,
        exec: () => {
          const { dispatch } = this.props
          dispatch(showLines())
        }
      },
      showFigures: {
        id: 20040,
        caption: 'Figures',
        keyValue: 'F6',
        enabled: true,
        checked: () => this.props.showFigures,
        exec: () => {
          const { dispatch } = this.props
          dispatch(showFigures())
        }
      }
    }

    levels.forEach( (l, idx) =>
      {
        this.actions['setLevel' + idx] = {
          id: 30000 + (idx + 1) * 10,
          caption: l,
          keyValue: idx.toString(),
          enabled: () => this.props.gameStage === gameStageEnum.ready || this.props.level <= idx,
          checked: () => this.props.level === idx,
          exec: () => {
            const { dispatch, timerID } = this.props
            dispatch(setLevel(dispatch, idx, timerID))
          }
        }
     }
    )
  }

  execKeyAction(event, action) {
    event.preventDefault()

    const { askName, showTop10 } = this.props

    if (!askName && !showTop10) {
      if (typeof action.enabled === 'boolean') {
        if (action.enabled) {
          action.exec()
        }
      } else {
        if (action.enabled()) {
          action.exec()
        }
      }
    }
  }

  processKeyEvent(event) {
    const { gameStage, figure, cells, dispatch } = this.props

    if (gameStage === gameStageEnum.inProgress && figure !== undefined) {
      if (event.keyCode === 37) {
        dispatch({ type: 'GAME_MOVE', dx: -1, dy: 0, turn: false })
      } else if (event.keyCode === 39) {
        dispatch({ type: 'GAME_MOVE', dx: 1, dy: 0, turn: false })
      } else if (event.keyCode === 38) {
        dispatch({ type: 'GAME_MOVE', dx: 0, dy: 0, turn: true })
      } else if (event.keyCode === 40) {
        while (store.getState().tetris.figure.canMove(0, 1, false, cells)) {
          dispatch({ type: 'GAME_MOVE', dx: 0, dy: 1, turn: false })
        }
        gameEngine(dispatch)
      }
    }
  }

  onCloseAskNameDlg(isOk, playerName) {
    const { dispatch, points, lines, gameStarted, gameEnded } = this.props
    dispatch(closeAskName(isOk, playerName, points, lines, gameStarted, gameEnded - gameStarted))
  }

  onClickCloseTS(erase) {
    const { dispatch } = this.props
    dispatch(closeTS(erase))
  }

  render() {
    return (
      <div className="App">
        <div className="quote">
          The best way to learn new technology is to do
          some meaningful project by yourself.
          <p/>
          So, for past 20+ years I did a simple tetris
          game quite a few times. Firstly, for MS-DOS text mode,
          then in graphics, and Windows 3.1 version came after
          that.
          <p/>
          I even did it for our <a href="http://gsbelarus.com/pw/front-page/platform/story/">Gedemin platform</a> as a proof
          of concept.
          <p/>
          Being new to js/react/redux stack I have
          remade good old Golden Tetris for Windows game
          trying to be as close to original as possible.
          Hence some limitations, for example game control
          requires keyboard presence.
          <p/>
          The sources are at <a href="https://github.com/gsbelarus/golden-tetris-5">github.com</a><br/>
          Please, feel free to copy and learn, as I did.
          <p/>
          Enjoy!
          <p/>
          Andrej Kirejeŭ
          <p/>
          @Golden Software of Belarus, Ltd
        </div>
        <Draggable handle=".WindowCaption" disabled={this.props.showTop10 || this.props.askName}>
          <div className="WindowBorder">

            <KeyHandler keyEventName={KEYDOWN} keyCode={37} onKeyHandle={this.processKeyEvent} />
            <KeyHandler keyEventName={KEYDOWN} keyCode={38} onKeyHandle={this.processKeyEvent} />
            <KeyHandler keyEventName={KEYDOWN} keyCode={39} onKeyHandle={this.processKeyEvent} />
            <KeyHandler keyEventName={KEYDOWN} keyCode={40} onKeyHandle={this.processKeyEvent} />

            <KeyHandler keyEventName={KEYPRESS} keyValue="F2" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.newGame) } />
            <KeyHandler keyEventName={KEYPRESS} keyValue="Escape" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.abortGame) } />
            <KeyHandler keyEventName={KEYPRESS} keyCode={19} onKeyHandle={ (e) => this.execKeyAction(e, this.actions.pauseGame) } />
            <KeyHandler keyEventName={KEYPRESS} keyValue="F9" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.topScores) } />

            <KeyHandler keyEventName={KEYPRESS} keyValue="F3" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.nextPiece) } />
            <KeyHandler keyEventName={KEYPRESS} keyValue="F4" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.showPoints) } />
            <KeyHandler keyEventName={KEYPRESS} keyValue="F5" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.showLines) } />
            <KeyHandler keyEventName={KEYPRESS} keyValue="F6" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.showFigures) } />
            <KeyHandler keyEventName={KEYPRESS} keyValue="F7" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.showLevel) } />

            <KeyHandler keyEventName={KEYPRESS} keyValue="0" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.setLevel0) } />
            <KeyHandler keyEventName={KEYPRESS} keyValue="1" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.setLevel1) } />
            <KeyHandler keyEventName={KEYPRESS} keyValue="2" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.setLevel2) } />
            <KeyHandler keyEventName={KEYPRESS} keyValue="3" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.setLevel3) } />
            <KeyHandler keyEventName={KEYPRESS} keyValue="4" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.setLevel4) } />
            <KeyHandler keyEventName={KEYPRESS} keyValue="5" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.setLevel5) } />
            <KeyHandler keyEventName={KEYPRESS} keyValue="6" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.setLevel6) } />
            <KeyHandler keyEventName={KEYPRESS} keyValue="7" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.setLevel7) } />
            <KeyHandler keyEventName={KEYPRESS} keyValue="8" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.setLevel8) } />
            <KeyHandler keyEventName={KEYPRESS} keyValue="9" onKeyHandle={ (e) => this.execKeyAction(e, this.actions.setLevel9) } />

            <WindowCaption caption="Golden Tetris" />
            <WindowMenu
              onMenuOpen = { () => this.props.dispatch(pauseGame()) }
              onMenuClose = { () => this.props.dispatch(resumeGame()) }
              enabled = {!this.props.showTop10 && !this.props.askName}
              items = {
              [
                ['Game', 10000, [
                  this.actions.newGame,
                  this.actions.abortGame,
                  this.actions.pauseGame,
                  '-',
                  ['Define keys...', '',      10040],
                  '-',
                  this.actions.topScores,
                  '-',
                  ['Exit',           'Alt-F4',10060]
                ]],
                ['View', 20000, [
                  this.actions.nextPiece,
                  '-',
                  this.actions.showPoints,
                  this.actions.showLines,
                  this.actions.showFigures,
                  this.actions.showLevel
                ]],
                ['Level', 30000, [
                  this.actions.setLevel0,
                  this.actions.setLevel1,
                  this.actions.setLevel2,
                  this.actions.setLevel3,
                  this.actions.setLevel4,
                  this.actions.setLevel5,
                  this.actions.setLevel6,
                  this.actions.setLevel7,
                  this.actions.setLevel8,
                  this.actions.setLevel9
                ]],
                ['Help', 40000, [
                  ['Contents',       'F1',    40010],
                  '-',
                  ['About...',       '',      40020]
                ]]
              ]
            } />
            <div className="Field">
              <div className="FieldInnerFrame">
                <GameWell />
                <div className="Buttons">
                  <LCDLabel counter={this.props.points} visible={this.props.showPoints} paused={this.props.paused} />
                  <LCDLabel counter={this.props.lines} visible={this.props.showLines} paused={this.props.paused} />
                  <LCDLabel counter={this.props.figures} visible={this.props.showFigures} paused={this.props.paused} />
                  <LCDLabel counter={this.props.level} visible={this.props.showLevel} paused={this.props.paused} />
                  <NextWell />
                </div>
              </div>
            </div>
            <InputBox
              windowCaption="New high score"
              label="Enter your name:"
              show={this.props.askName}
              onClose={this.onCloseAskNameDlg}
              inputValue={this.props.lastName} />
            <TopScoresBox
              windowCaption="High scores"
              show={this.props.showTop10}
              topScores={this.props.top10}
              onClickClose={this.onClickCloseTS} />
          </div>
        </Draggable>
      </div>
    )
  }
}

App.propTypes = {
  points: propTypes.number.isRequired,
  gameStage: propTypes.number.isRequired,
  figure: propTypes.object,
  cells: propTypes.array
}

export default connect(
  state => ({
    points: state.points,
    lines: state.lines,
    figures: state.figures,
    gameStage: state.tetris.gameStage,
    figure: state.tetris.figure,
    cells: state.tetris.cells,
    level: state.level,
    timerID: state.tetris.timerID,
    nextPiece: state.ui.nextPiece,
    showLevel: state.ui.showLevel,
    showPoints: state.ui.showPoints,
    showLines: state.ui.showLines,
    showFigures: state.ui.showFigures,
    paused: state.tetris.gameStage === gameStageEnum.paused,
    gameStarted: state.tetris.gameStarted,
    gameEnded: state.tetris.gameEnded,
    askName: state.topScores.askName,
    showTop10: state.topScores.show,
    top10: state.topScores.data.top10,
    lastName: state.topScores.data.lastName
  })
)(App)

