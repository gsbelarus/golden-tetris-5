import React from 'react'
import classNames from 'classnames'
import { cellInFire } from './../../unit/const.js'
import './index.css'

const Cell = ({ color }) => {
  if (color === cellInFire) {
    return <span className="fire" />
  } else {
    return <span className="cell" style={{backgroundPosition: `-${color * 16}px`}}/>
  }
}

const Row = ({ y, w, getCellColor }) => {
  const cells = []
  for (let x = 0; x < w; x++) {
    cells.push(<Cell color={getCellColor(x, y)} key={x} />)
  }

  return (
    <div className='row'>
      {cells}
    </div>
  )
}

const Well = ({ w, h, getCellColor, visible, paused }) => {
  const rows = []
  for (let y = 0; y < h; y++) {
    rows.push(<Row y={y} w={w} getCellColor={getCellColor} key={y} />)
  }

  return(
    <div className={classNames('well-border', {hidden: !visible, paused})}>
      <div className='well'>
        {rows}
      </div>
    </div>
  )
}

export default Well