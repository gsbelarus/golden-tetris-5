import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.css'
import Draggable from 'react-draggable'

class InputBox extends Component {

  constructor (props) {
    super(props)
    this.state = {
      inputValue: this.props.inputValue
    }
    this.updateInputValue = this.updateInputValue.bind(this)
    this.onClickOk = this.onClickOk.bind(this)
    this.onClickCancel = this.onClickCancel.bind(this)
  }

  updateInputValue (e) {
    this.setState({ inputValue: e.target.value })
  }

  onClickOk () {
    this.props.onClose(true, this.state.inputValue)
  }

  onClickCancel () {
    this.props.onClose(false)
  }

  render () {

    if (!this.props.show) {
      return null
    }

    return (
      <Draggable handle=".modal-caption">
        <div className="modal-border">
          <div className="modal-caption">
            {this.props.windowCaption}
          </div>
          <form>
            <div className="modal-client-area">
              <div>{this.props.label}</div>
              <input autoFocus type="text" value={this.state.inputValue} onChange={this.updateInputValue} />
            </div>
            <div className="modal-buttons">
              <button onClick={this.onClickOk}>
                OK
              </button>
              <button onClick={this.onClickCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Draggable>
    )
  }

}

InputBox.propTypes = {
  show: PropTypes.bool,
  windowCaption: PropTypes.string,
  label: PropTypes.string,
  inputValue: PropTypes.string,
  onClose: PropTypes.func
}

export default InputBox