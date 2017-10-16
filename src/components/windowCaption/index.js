import React from 'react'
import './index.css'

export default ({ caption }) => {
  return (
    <div className="WindowCaption">
      <span className="WindowIcon" />
      <span className="CaptionText">{caption}</span>
    </div>
  )
}