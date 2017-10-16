import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import classNames from 'classnames'
import './index.css'

class WindowMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {opened: -1};
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  handleClickOutside = evt => {
    const prevOpened = this.state.opened
    this.setState({opened: -1})
    if (prevOpened !== -1) {
      this.props.onMenuClose()
    }
  }

  render () {
    const { items, onMenuClose, onMenuOpen, enabled } = this.props

    if (enabled) {
      return (
        <div className="WindowMenu">
        {items.map( (i, idx) => Array.isArray(i) ?
          <span className="dropdown" key={idx}>
            <button className="dropbtn" onClick={
                (e) => {
                  const openedID = parseInt(e.target.nextSibling.id, 10)
                  const opened = this.state.opened === openedID ? -1 : openedID
                  this.setState({ opened })
                  if (opened !== -1) {
                    onMenuOpen()
                  }
                }}>
              {i[0]}
            </button>
            <div className={classNames("dropdown-content", {show: i[1] === this.state.opened})} id={i[1]}>
              { i[2].map( (s, idx) => Array.isArray(s) ?
                <div id={s[2]} key={idx} className="disabled"><span className="item-caption">{s[0]}</span><span className="item-shortcut">{s[1]}</span></div>
                :
                s === '-' ?
                <div className="menu-separator" key={idx} />
                :
                <div id={s.id} key={idx} className={classNames({ disabled: !(typeof s.enabled === 'boolean' ? s.enabled : s.enabled()) })}
                  onClick={ (e) => {
                      this.setState({ opened: -1 })
                      onMenuClose()
                      if (typeof s.enabled === 'boolean') {
                        if (s.enabled) {
                          s.exec()
                        }
                      } else {
                        if (s.enabled()) {
                          s.exec()
                        }
                      }
                    }
                  }>
                  <span className={classNames("item-caption", { checked: typeof s.checked === 'boolean' ? s.checked : s.checked() })}>{ typeof s.caption === 'string' ? s.caption : s.caption() }</span>
                  <span className="item-shortcut">{ s.keyValue }</span>
                </div>
              ) }
            </div>
          </span>
          :
          <a href={"#" + i} key={idx}>{i}</a> )}
        </div>
      )
    } else {
      return (
        <div className="WindowMenu">
          {items.map( (i, idx) =>
            <a key={idx}>{Array.isArray(i) ? i[0] : i}</a> )}
        </div>
      )
    }
  }
}

export default onClickOutside(WindowMenu)


