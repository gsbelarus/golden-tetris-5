
const maxPoint = 99999
const pointsPerLevel = 4000

const gameStageEnum = {
  ready: 0,
  inProgress: 1,
  paused: 2,
  inAnimation: 3,
  showModal: 4
}

const cellInFire = 100

const burnRowsPoints = [1, 4, 9, 16]

const minLevel = 0
const maxLevel = 9
const defLevel = 5
const levels = [
  'Novice',
  'More than easy',
  'Easy',
  'Medium',
  'Enough hard',
  'Difficult',
  'Very hard',
  'Ultra complicated',
  'Terrific',
  'Only for superman'
]

const levelDelay = 100
const minimalDelay = 120

const storageKey = 'GOLDEN_TETRIS_5'

const lastRecord = (() => {
  let data = localStorage.getItem(storageKey)

  if (!data) {
    return false
  }

  try {
    data = JSON.parse(data)
  } catch (e) {
    if (window.console || window.console.error) {
      window.console.error(e)
    }
    return false
  }
  return data
})()

const isMobile = () => {
  const ua = navigator.userAgent
  const android = /Android (\d+\.\d+)/.test(ua)
  const iphone = ua.indexOf('iPhone') > -1
  const ipod = ua.indexOf('iPod') > -1
  const ipad = ua.indexOf('iPad') > -1
  const nokiaN = ua.indexOf('NokiaN') > -1
  return android || iphone || ipod || ipad || nokiaN
}

module.exports = {
  maxPoint,
  gameStageEnum,
  cellInFire,
  burnRowsPoints,
  minLevel,
  maxLevel,
  levels,
  levelDelay,
  minimalDelay,
  defLevel,
  storageKey,
  lastRecord,
  pointsPerLevel,
  isMobile
}




