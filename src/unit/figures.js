
class Figure {
  constructor() {
    this.x = 0
    this.y = 0
    this.o = 0
    this.shape = []
    this.color = 0
    this.points = 0
  }

  getWidth() {
    return this.shape[this.o].reduce( (p, {x}) => x > p ? x : p, -4 ) -
      this.shape[this.o].reduce( (p, {x}) => x < p ? x : p, 4) + 1
  }

  getHeight() {
    return this.shape[this.o].reduce( (p, {y}) => y > p ? y : p, -4 ) -
      this.shape[this.o].reduce( (p, {y}) => y < p ? y : p, 4) + 1
  }

  nextO() {
    return this.o < this.shape.length - 1 ? this.o + 1 : 0
  }

  canMove(dx, dy, nextO, cells) {
    return this.projectShape(dx, dy, nextO).every( (c) =>
      c.y >= 0 && c.y < cells.length &&
      c.x >= 0 && c.x < cells[c.y].length &&
      !cells[c.y][c.x])
}

  projectShape(dx = 0, dy = 0, nextO = false) {
    if (!this.shape.length) {
      return []
    } else {
      return this.shape[nextO ? this.nextO() : this.o].map(p => ({x: p.x + this.x + dx, y: p.y + this.y + dy}))
    }
  }

  getCellColor(x, y, c) {
    return this.projectShape().findIndex(e => e.x === x && e.y === y) > -1 ? this.color : c
  }

  merge(cells) {
    return cells.map( (r, y) => r.map( (c, x) =>
      this.projectShape().findIndex( e => e.x === x && e.y === y ) > -1 ? this.color : c ))
  }
}

export class Square extends Figure {
  constructor (wellWidth) {
    super(wellWidth)
    this.shape = [[
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 1},
      {x: 1, y: 1}
    ]]
    this.color = 1
    this.points = 5
  }
}

export class Bar extends Figure {
  constructor (wellWidth) {
    super(wellWidth)
    this.shape = [
      [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 3, y: 0}
      ],
      [
        {x: 2, y: -1},
        {x: 2, y: 0},
        {x: 2, y: 1},
        {x: 2, y: 2}
      ],
      [
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 3, y: 0},
        {x: 4, y: 0}
      ],
      [
        {x: 2, y: -2},
        {x: 2, y: -1},
        {x: 2, y: 0},
        {x: 2, y: 1}
      ]
    ]
    this.color = 3
    this.points = 5
  }
}

export class TShape extends Figure {
  constructor (wellWidth) {
    super(wellWidth)
    this.shape = [
      [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 1, y: 1}
      ],
      [
        {x: 1, y: -1},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 0}
      ],
      [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 1, y: -1}
      ],
      [
        {x: 0, y: 0},
        {x: 1, y: -1},
        {x: 1, y: 0},
        {x: 1, y: 1}
      ]
    ]
    this.color = 2
    this.points = 8
  }
}

export class LShape extends Figure {
  constructor (wellWidth) {
    super(wellWidth)
    this.shape = [
      [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 0, y: 1}
      ],
      [
        {x: 1, y: -1},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 1}
      ],
      [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 2, y: -1}
      ],
      [
        {x: 0, y: -1},
        {x: 1, y: -1},
        {x: 1, y: 0},
        {x: 1, y: 1}
      ]
    ]
    this.color = 4
    this.points = 8
  }
}

export class GShape extends Figure {
  constructor (wellWidth) {
    super(wellWidth)
    this.shape = [
      [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 2, y: 1}
      ],
      [
        {x: 1, y: -1},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 2, y: -1}
      ],
      [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 0, y: -1}
      ],
      [
        {x: 1, y: -1},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 0, y: 1}
      ]
    ]
    this.color = 5
    this.points = 8
  }
}

export class SShape extends Figure {
  constructor (wellWidth) {
    super(wellWidth)
    this.shape = [
      [
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 1, y: 0},
        {x: 2, y: 0}
      ],
      [
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 1, y: -1},
        {x: 2, y: 1}
      ],
      [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: -1},
        {x: 2, y: -1}
      ],
      [
        {x: 0, y: -1},
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 1}
      ]
    ]
    this.color = 6
    this.points = 9
  }
}

export class ZShape extends Figure {
  constructor (wellWidth) {
    super(wellWidth)
    this.shape = [
      [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 1}
      ],
      [
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 0},
        {x: 2, y: -1}
      ],
      [
        {x: 0, y: -1},
        {x: 1, y: -1},
        {x: 1, y: 0},
        {x: 2, y: 0}
      ],
      [
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 0},
        {x: 1, y: -1}
      ]
    ]
    this.color = 7
    this.points = 9
  }
}

export const getRandomFigure = () => {
  switch (Math.floor(Math.random() * 7)) {
    case 1:
      return new TShape()
    case 2:
      return new Bar()
    case 3:
      return new LShape()
    case 4:
      return new GShape()
    case 5:
      return new SShape()
    case 6:
      return new ZShape()
    default:
      return new Square()
  }
}


