/////////// Forniture
class Forniture {
  constructor(x, y, w, h, rotation, img, name) {
    this.img = img
    this.x = x
    this.y = y
    this.width = w
    this.height = h
    this.rotation = rotation
    this.over = false
    this.name = name
  }

  display() {
    push()
    
    translate(this.x, this.y);
    rotate(this.rotation);
    this.containsPoint();

    image(this.img, 0, 0, this.width, this.height, 0, 0, this.img.width, this.img.height, COVER, CENTER)

    pop()

    if (this.over) {
      push()

      textSize(18)
      fill('#8A9085')
      rectMode(CENTER)
      text(this.name, this.x + this.width/2, this.y - 5, 60, 30)

      pop()
    }
  }
  
  sign(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)
  }
  
  pointInTriangle(p1, triangle) {
    let d1, d2, d3, hasNeg, hasPos
    
    d1 = this.sign(p1, triangle.A, triangle.B)
    d2 = this.sign(p1, triangle.B, triangle.C)
    d3 = this.sign(p1, triangle.C, triangle.A)
    
    hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0)
    hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0)
    
    return !(hasNeg && hasPos)
  }
  
  getPoints() {
    var interX = this.x - Math.sin(this.rotation * Math.PI / 180) * this.height;
    var interY = this.y + Math.cos(this.rotation * Math.PI / 180) * this.height;
    this.rectanglePoints = {
      A: {x: this.x,
          y: this.y},
      B: {x: this.x + Math.sin((90 - this.rotation) * Math.PI / 180) * this.width,
          y: this.y + Math.cos((90 - this.rotation) * Math.PI / 180) * this.width},
      C: {x: interX,
          y: interY},
      D: {x: interX + Math.cos(this.rotation * Math.PI / 180) * this.width,
          y: interY + Math.sin(this.rotation * Math.PI / 180) * this.width}
    };
  }
  
  containsPoint() {
    this.getPoints()
    let mousePoint = {x: mouseX, y: mouseY}
    
    let triangle1 = {
      A: this.rectanglePoints.A,
      B: this.rectanglePoints.B,
      C: this.rectanglePoints.C
    }
    
    let triangle2 = {
      A: this.rectanglePoints.B,
      B: this.rectanglePoints.C,
      C: this.rectanglePoints.D
    }
    
    this.over = this.pointInTriangle(mousePoint, triangle1) || this.pointInTriangle(mousePoint, triangle2)
  }

  pressed() {
    if(this.over) {
      state.current = this.name
    }
  }
}

/////////// Start state
class StartButton {

  cosntructor() {
  }

  create() {
    push()
    let btn = createButton('Start')
    btn.mousePressed(function() {
      state.current = States.main
      getAudioContext().resume()
      streetSound.loop()
    })
    btn.position(cnvx+canvasWidth/2 - 30, cnvy+canvasHeight/2)
    btn.id('start-btn')
    pop()
  }

  display() {
    if (!select('#start-btn')) {
      this.create()
    }
  }

  pressed() {

  }
}

let startButtonRef = new StartButton()

/////////// Sofa state
class Sofa {
  constructor() {
  }

  create() {
    let playerSize = createElement('div').id('player-size')
    let croppingDiv = createElement('div').id('cropping-div')
    let divToCrop = createElement('div').id('div-to-crop')
    let player = createElement('div').id('player-wrapper')
    playerSize.child(croppingDiv)
    croppingDiv.child(divToCrop)
    divToCrop.child(player)
    let iframe = createElement('iframe')
    iframe.id('player')
    iframe.attribute('src', 'https://www.youtube.com/embed/eJP9MRr2YWM?&vq=hd1080ptheme=dark&autoplay=1&autohide=2&modestbranding=1&fs=0&showinfo=0&rel=0&iv_load_policy=3')
    iframe.attribute('width', '400')
    iframe.attribute('height', '235')
    iframe.attribute('frameborder', '0')
    iframe.attribute('allow', 'autoplay')
    player.child(iframe)
    playerSize.style('zIndex', '10')
    playerSize.position(cnvx + canvasWidth/2 - 760/2, cnvy + canvasHeight/2 - 420/2)
  }

  display() {
    if (!select('#player')) {
      this.create()
    }
  }

  pressed() {

  }
}

/////////// Preload assets
let streetSound, sofaImg, windowImg, fanImg, tvImg, frameImg
let canvasWidth = 800
let canvasHeight = 457

function preload() {
  streetSound = loadSound('assets/audioRuaInicial.mp3')
  streetSound.setVolume(0.1)
  sofaImg = loadImage('assets/sofa.png')
  windowImg = loadImage('assets/janela.png')
  fanImg = loadImage('assets/ventilador.png')
  tvImg = loadImage('assets/tv.png')
  frameImg = loadImage('assets/frame.png')
}

/////////// UI State
const States = {
  start: 'start',
  main: 'main',
  sofa: 'sofa',
}

// let state = States.start
let state = {
  state: States.start,
  set current(value) {
    this.state = value
    removeElements()
  },
  get current() {
    return this.state
  }
}



let uiItems = []

let fan, tv, wind, sofa, sofaState
let cnvx, cnvy, cnv
let title
let closebtn

/////////// Canvas
function setup() {
  cnv = createCanvas(800, 457)
  cnvx = (windowWidth - width) / 2;
  cnvy = (windowHeight - height) / 2;
  cnv.position(cnvx, cnvy);

  fan = new Forniture(524, 228, 52, 118, -2, fanImg, "ventilador")
  tv = new Forniture(442, 108, 95, 83, -3, tvImg, "tv")
  wind = new Forniture(252, 28, 99, 93, 0, windowImg, "janela")
  sofa = new Forniture(230, 230, 243, 116, 8, sofaImg, "sofa")
  sofaState = new Sofa()
  title = new Title()
  closebtn = new Closebtn()
  
  frameRate(60)
  angleMode(DEGREES)
  outputVolume(0.8)
}

function draw() {
  background(255)
  image(frameImg, 0, 0, 800, 457, 0, 0, frameImg.width, frameImg.height, CONTAIN, CENTER)
  // removeElements()
  uiItems = [title]
  
  switch (state.current) {
    case States.start:
      uiItems.push(startButtonRef)
      break
    case States.main:
      uiItems.push(fan, tv, wind, sofa)
      break
    case States.sofa:
      uiItems.push(closebtn, sofaState)
      break
  }
  uiItems.forEach(function(ele) {
    push()
    ele.display()
    pop()
  })
}

class Title {
  constructor() {
    this.create()
  }

  create() {
    let title = createP("como as coisas não são")
    title.style('font-size', '50px')
    title.style('color', '#8A9085')
    title.style('font-family', 'Karla')
    title.position(cnvx - 120, cnvy - 120)
    title.id('title')
  }

  display() {
    let title = select('#title')
    if (!title) {
      this.create() 
    }
  }

  pressed() {

  }
}
class Closebtn {

  display() {
    if (!select('#close-btn')) {
      this.create()
    }
  }

  create() {
    let btn = createButton('x')
    btn.attribute('type', 'button')
    btn.id('close-btn')
    btn.style('zIndex', '11')
    btn.position(cnvx+canvasWidth - 40, cnvy + 25)
    btn.mouseClicked(this.close)
  }

  close() {
    state.current = States.main
  }

  pressed() {

  }
}

function mousePressed() {
  uiItems.forEach(function(ele) {
    ele.pressed()
  })
}

function windowResized() {
  centerCanvas()
}

function centerCanvas() {
  cnvx = (windowWidth - width) / 2;
  cnvy = (windowHeight - height) / 2;
  cnv.position(cnvx, cnvy);
}