import React from 'react'
import PropTypes from 'prop-types'
import './index.css'

const xStateButton = (props) => (
  <button
    className="ui button stateButton"
    onClick={props.onClick}
  >
    {props.caption}
  </button>
)

xStateButton.propTypes = {
  caption: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default xStateButton