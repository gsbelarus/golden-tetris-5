import React, { Component } from 'react'
import './index.css'
import Draggable from 'react-draggable'
import Moment from 'react-moment'

class TopScoresBox extends Component {

  msToTime(duration) {
    var seconds = parseInt((duration / 1000) % 60, 10)
        , minutes = parseInt((duration / (1000 * 60)) % 60, 10)
        , hours = parseInt((duration / (1000 * 60 * 60)) % 24, 10)

    hours = (hours < 10) ? '0' + hours : hours
    minutes = (minutes < 10) ? '0' + minutes : minutes
    seconds = (seconds < 10) ? '0' + seconds : seconds

    return hours + ':' + minutes + ':' + seconds
  }

  render () {

    const { show, topScores, windowCaption, onClickClose } = this.props

    if (!show) {
      return null
    }

    let dlgBody, btnErase

    if (topScores.length) {
      dlgBody =
        <table>
          <thead>
            <tr>
              <th></th><th>Name</th><th>Date</th><th>Score</th><th>Lines</th><th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {topScores.map(
              (e, idx) =>
                <tr key={idx}>
                  <td>{idx + 1}</td><td>{e.name}</td>
                  <td><Moment format="DD.MM.YYYY">{e.date}</Moment>
                  </td><td>{e.score}</td><td>{e.lines}</td>
                  <td>{this.msToTime(e.duration)}</td>
                </tr>)}
          </tbody>
        </table>
      btnErase =
        <button onClick={ () => onClickClose(true) }>
          Erase
        </button>
    } else {
      dlgBody = 'No high scores yet!'
      btnErase = null
    }

    return (
      <Draggable handle=".ts-caption">
        <div className="ts-border">
          <div className="ts-caption">
            {windowCaption}
          </div>
          <div className="ts-inner-border">
            <div>
              <div>
                <div>
                  <div className="ts-client-area">
                    {dlgBody}
                  </div>
                  <div className="ts-buttons">
                    <button autoFocus onClick={ () => onClickClose(false) }>
                      Close
                    </button>
                    {btnErase}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
    )

  }

}

export default TopScoresBox