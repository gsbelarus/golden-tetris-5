import React from 'react'
import './index.css'
import classNames from 'classnames'

const digitsCount = 5

const LCDDigit = ({ v }) => (
  <div className={`lcd-digit lcd-digit-${v}`} />
)

export default ({ counter, visible, paused }) => {
  return (
    <div className={classNames('lcd-outer-border',
        {hidden: typeof visible === 'boolean' && !visible, paused})}>
      <div className="lcd-border">
        {counter.toString().padStart(digitsCount).split('').map(
          (d, i) => <LCDDigit key={i} v={d} />)}
      </div>
    </div>
  )
}