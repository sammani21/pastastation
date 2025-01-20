export class Level1 extends Phaser.Scene {
  constructor() {
    super("Level1")
  }

  preload() {
    this.load.image("level-1-bg", "assets/level-1-bg.png")
    this.load.image("choppingBoard", "assets/chopping-board.png")
    this.load.image("clipboard", "assets/clipboard.png")
    this.load.image("flour", "assets/flour.png")
    this.load.image("flourEggOne", "assets/flour-egg-1.png")
    this.load.image("flourEggTwo", "assets/flour-egg-2.png")
    this.load.image("flourJar", "assets/sprites/flour-jar.png")
    this.load.image("saltJar", "assets/sprites/salt-jar.png")
    this.load.image("semolinaJar", "assets/sprites/semolina-flour-jar.png")
    this.load.image("oliveOil", "assets/sprites/olive-oil.png")
    this.load.image("knife", "assets/sprites/knife.png")
    this.load.image("eggCarton", "assets/egg-carton.png")
    this.load.image("egg", "assets/egg.png")
    this.load.image("eggOutline", "assets/egg-outline.png")
    this.load.image("whisk", "assets/sprites/whisk.png")
    this.load.image("whiskedEggs", "assets/whisked-eggs.png")
    this.load.image("napkin", "assets/napkin.png")
    this.load.image("tissues", "assets/tissues.png")
    this.load.image("tomatoes", "assets/sprites/tomatoes.png")
    this.load.image("basil", "assets/sprites/basil.png")
    this.load.image("sparkle", "assets/sparkle.png")
    this.load.image("flourParticle", "assets/flour-particle.png")
    this.load.image("spiral", "assets/spiral.png")
    this.load.image("rollingPin", "assets/rolling-pin.png")
    this.load.image("slice1", "assets/sliced-dough/1.png")
    this.load.image("slice2", "assets/sliced-dough/2.png")
    this.load.image("slice3", "assets/sliced-dough/3.png")
    this.load.image("slice4", "assets/sliced-dough/4.png")

    this.load.spritesheet("kneading", "assets/kneading-sprites/sprite.png", {
      frameWidth: 1000,
      frameHeight: 1000,
    })
  }

  create() {
    this.hoverSound = this.sound.add("hover")
    this.wrongOption = this.sound.add("wrongOption")
    this.selectSound = this.sound.add("select")

    this.setBg()
    this.setChoppingBoard()
    this.setInstructions()
    this.setItems()
    this.showToast("Welcome to the game!", 2000)

    this.handleFirstStep()
  }

  markStepCompleted() {
    const graphics = this.add.graphics()
    graphics.fillStyle(0x00ff00, 1)

    graphics.fillRect(
      this.cameras.main.width - 490,
      this.cameras.main.height / 2 + 50 * this.currentStep - 165,
      30,
      30
    )

    this.currentStep++
  }

  setItems() {
    const createItem = (x, y, key, scale, origin = { x: 0.5, y: 0.5 }) => {
      const item = this.add
        .image(x, y, key)
        .setScale(scale)
        .setOrigin(origin.x, origin.y)
        .setInteractive()
        .setDepth(2)
      item.preFX.addShadow()
      return item
    }

    this.items = {
      saltJar: { x: 1050, y: 110, key: "saltJar", scale: 0.09 },
      napkin: { x: 200, y: 1050, key: "napkin", scale: 0.3 },
      semolinaJar: { x: 520, y: 400, key: "semolinaJar", scale: 0.12 },
      eggCarton: {
        x: -0,
        y: 10,
        key: "eggCarton",
        scale: 0.2,
        origin: { x: 0, y: 0 },
      },
      flourJar: {
        x: 0,
        y: 440,
        key: "flourJar",
        scale: 0.2,
        origin: { x: 0, y: 0 },
      },
      oliveOil: { x: 510, y: 130, key: "oliveOil", scale: 0.1 },
      tomatoes: { x: 200, y: 1050, key: "tomatoes", scale: 0.15 },
      basil: { x: 530, y: 1080, key: "basil", scale: 0.18 },
      whisk: { x: 550, y: 690, key: "whisk", scale: 0.4 },
      knife: { x: 1150, y: 250, key: "knife", scale: 0.4 },
      tissues: { x: 750, y: 160, key: "tissues", scale: 0.15 },
      rollingPin: {
        x: 950,
        y: 1050,
        key: "rollingPin",
        scale: 0.2,
        origin: { x: 0.5, y: 0.5 },
      },
    }

    Object.entries(this.items).forEach(([key, item]) => {
      const createdItem = createItem(
        item.x,
        item.y,
        item.key,
        item.scale,
        item.origin || undefined
      )

      let glow
      createdItem.on("pointerover", () => {
        this.hoverSound.play()
        glow = createdItem.preFX.addGlow("0xffc75e", 1, 0, false)
      })
      createdItem.on("pointerout", () => {
        glow?.setActive(false)
      })

      this.items[key] = createdItem
    })

    this.setEggs()
  }

  setEggs() {
    this.items.eggs = []
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const egg = this.add
          .image(100 + i * 110, 100 + j * 100, "egg")
          .setScale(0.09)
          .setDepth(3)
          .setInteractive()
        egg.preFX.addShadow()
        this.items.eggs.push(egg)
      }
    }
  }

  handleFirstStep() {
    const { x, y } = this.items.flourJar
    this.showToast("Select the flour and drag it to the main area", 10000)
    this.input.setDraggable(this.items["flourJar"])

    this.items.flourJar.on("drag", (pointer, dragX, dragY) => {
      this.items.flourJar.x = dragX
      this.items.flourJar.y = dragY
    })

    this.items["flourJar"].on("dragend", () => {
      const object1Bounds = this.items.flourJar.getBounds()
      const object2Bounds = this.choppingBoard.getBounds()

      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          object1Bounds,
          object2Bounds
        ) &&
        this.currentStep === 0
      ) {
        this.selectSound.play()
        this.currentStepObj = this.add
          .image(
            this.cameras.main.width / 2 + 20,
            this.cameras.main.height / 2 + 20,
            "flour"
          )
          .setOrigin(0.5, 0.5)
          .setInteractive()

        this.currentStepObj.preFX.addShadow(0, 0, 0.1, 1, "0x000000", 6, 0.5)

        this.tweens.add({
          targets: this.currentStepObj,
          alpha: { from: 0, to: 1 },
          scale: { from: 0, to: 1 },
          duration: 1000,
          ease: "Power0",
          yoyo: false,
          repeat: 0,

          onComplete: () => {
            this.markStepCompleted()
            this.handleSecondStep()
          },
        })

        this.addSparkle(
          this.cameras.main.width / 2 + 20,
          this.cameras.main.height / 2 + 20
        )
      } else {
        this.wrongOption.play()
      }
      this.tweens.add({
        targets: this.items.flourJar,
        x,
        y,
        duration: 500,
        ease: "Power0",
        yoyo: false,
        repeat: 0,
      })
    })
  }

  setChoppingBoard() {
    this.choppingBoard = this.add
      .image(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        "choppingBoard"
      )
      .setOrigin(0.5, 0.5)
    this.choppingBoard.setScale(800 / this.choppingBoard.width)
    this.choppingBoard.preFX.addShadow()
  }

  setInstructions() {
    this.clipboard = this.add
      .image(
        this.cameras.main.width - 750,
        this.cameras.main.height / 2,
        "clipboard"
      )
      .setOrigin(0, 0.5)
    this.clipboard.setScale(800 / this.clipboard.width)
    this.clipboard.preFX.addShadow()

    const instructions = [
      "Add 200g flour",
      "Crack 2 eggs",
      "Whisk the eggs",
      "Knead the dough and\neggs",
      "Rest the dough for\n30 min",
      "Cut the dough",
      "Roll into thin sheets",
      "Fold in half",
      "Cut noodles",
    ]

    this.currentStep = 0

    for (let i = 0; i < instructions.length; i++) {
      const instructionText = this.add.text(
        this.cameras.main.width - 450,
        this.cameras.main.height / 2 + 50 * i - 150,
        instructions[i],
        {
          fontSize: "26px",
          fontFamily: "PixelFont",
          fill: "#000000",
        }
      )
      instructionText.setOrigin(0, 0.5)

      const graphics = this.add.graphics()
      graphics.fillStyle(0xffffff, 1)
      graphics.fillRect(
        this.cameras.main.width - 490,
        this.cameras.main.height / 2 + 50 * i - 165,
        30,
        30
      )
    }
  }

  setBg() {
    const bg = this.add.image(0, 0, "level-1-bg")
    bg.setOrigin(0, 0)
    bg.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height)
    bg.preFX.addVignette(0.5, 0.5, 0.9, 0.5)
  }

  handleSecondStep() {
    this.showToast("Select the egg and drag it to the main area", 10000)
    let eggOutline = this.add
      .image(
        this.cameras.main.width / 2 - 20,
        this.cameras.main.height / 2 + 30,
        "eggOutline"
      )
      .setScale(0.05)
      .setInteractive()

    this.tweens.add({
      targets: [eggOutline],
      alpha: 0.2,
      duration: 500,
      ease: "Power0",
      yoyo: true,
      repeat: -1,
    })

    let eggsCracked = 0

    this.items["eggs"].forEach((egg) => {
      this.input.setDraggable(egg)

      let [x, y] = [egg.x, egg.y]

      egg.on("drag", (pointer, dragX, dragY) => {
        egg.x = dragX
        egg.y = dragY
      })

      egg.on("dragend", () => {
        const object1Bounds = egg.getBounds()
        const object2Bounds = this.currentStepObj.getBounds()

        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            object1Bounds,
            object2Bounds
          ) &&
          this.currentStep === 1
        ) {
          egg.destroy()
          eggOutline.destroy()
          this.selectSound.play()

          this.currentStepObj.destroy()
          if (eggsCracked === 0) {
            this.currentStepObj = this.add
              .image(
                this.cameras.main.width / 2 + 20,
                this.cameras.main.height / 2 + 20,
                "flourEggOne"
              )
              .setOrigin(0.5, 0.5)
              .setInteractive()
            this.currentStepObj.setScale(500 / this.currentStepObj.width)
            this.currentStepObj.preFX.addShadow(
              0,
              0,
              0.1,
              1,
              "0x000000",
              6,
              0.5
            )
            this.addSparkle(
              this.cameras.main.width / 2 + 20,
              this.cameras.main.height / 2 + 20
            )
            eggsCracked++
            eggOutline = this.add
              .image(
                this.cameras.main.width / 2 + 50,
                this.cameras.main.height / 2 + 20,
                "eggOutline"
              )
              .setScale(0.05)
              .setInteractive()

            this.tweens.add({
              targets: [eggOutline],
              alpha: 0.2,
              duration: 500,
              ease: "Power0",
              yoyo: true,
              repeat: -1,
            })
          } else {
            eggOutline.destroy()
            this.currentStepObj.destroy()
            this.currentStepObj = this.add
              .image(
                this.cameras.main.width / 2 + 20,
                this.cameras.main.height / 2 + 20,
                "flourEggTwo"
              )
              .setOrigin(0.5, 0.5)
              .setInteractive()
            this.currentStepObj.setScale(500 / this.currentStepObj.width)
            this.currentStepObj.preFX.addShadow(
              0,
              0,
              0.1,
              1,
              "0x000000",
              6,
              0.5
            )
            this.addSparkle(
              this.cameras.main.width / 2 + 20,
              this.cameras.main.height / 2 + 20
            )
            this.markStepCompleted()
            this.handleThirdStep()
          }
        } else {
          this.wrongOption.play()
          this.tweens.add({
            targets: egg,
            x,
            y,
            duration: 500,
            ease: "Power2",
          })
        }
      })
    })
  }

  handleThirdStep() {
    this.showToast("Select the whisk and move it to whisk the eggs", 10000)
    const spiral = this.add
      .image(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        "spiral"
      )
      .setOrigin(0.5, 0.5)
      .setScale(0.1)
      .setAlpha(0.1)

    this.tweens.add({
      targets: spiral,
      angle: 360,
      duration: 3000,
      ease: "Linear",
      repeat: -1,
    })

    const whisk = this.items["whisk"]
    const { x, y } = whisk

    this.input.setDraggable(whisk)

    let lastX = null
    let whiskCount = 0
    let whiskingComplete = false

    whisk.on("dragstart", (pointer) => {
      if (whiskingComplete) return
      this.addSparkle(
        this.cameras.main.width / 2 + 20,
        this.cameras.main.height / 2 + 20
      )
    })

    whisk.on("drag", (pointer, dragX, dragY) => {
      if (this.currentStep !== 2) return
      whisk.x = dragX
      whisk.y = dragY

      if (lastX !== null) {
        if (Math.abs(dragX - lastX) > 100) {
          whiskCount++
          lastX = dragX
          if (whiskCount % 4 === 0 && !whiskingComplete) {
            this.addSparkle(
              this.cameras.main.width / 2 + 20,
              this.cameras.main.height / 2 + 20
            )
          }
        }
      } else {
        lastX = dragX
      }

      if (whiskCount === 20 && !whiskingComplete) {
        whiskingComplete = true
        this.currentStepObj.destroy()
        this.currentStepObj = this.add
          .image(
            this.cameras.main.width / 2 + 20,
            this.cameras.main.height / 2 + 20,
            "whiskedEggs"
          )
          .setOrigin(0.5, 0.5)
          .setInteractive()
        this.currentStepObj.setScale(500 / this.currentStepObj.width)

        this.currentStepObj.preFX.addShadow(0, 0, 0.1, 1, "0x000000", 6, 0.5)
        spiral.destroy()
        this.showToast("Whisking Completed!", 3000)
        this.markStepCompleted()
        this.handleFourthStep()
      }
    })

    whisk.on("dragend", () => {
      lastX = null

      this.tweens.add({
        targets: whisk,
        x,
        y,
        duration: 500,
        ease: "Power2",
      })
    })
  }

  handleFourthStep() {
    this.showToast("Click on the flour to knead the dough", 5000)

    let kneadingStarted = false
    this.anims.create({
      key: "knead",
      frames: this.anims.generateFrameNumbers("kneading", {
        start: 0,
        end: 15,
      }),
      frameRate: 5,
      repeat: 0,
    })

    this.currentStepObj.on("pointerdown", () => {
      if (!kneadingStarted) {
        kneadingStarted = true
        this.currentStepObj.destroy()
        this.currentStepObj = this.add
          .sprite(
            this.cameras.main.width / 2 + 20,
            this.cameras.main.height / 2 + 20,
            "kneading"
          )
          .setOrigin(0.5, 0.5)
        this.currentStepObj.setScale(400 / this.currentStepObj.width)
        this.currentStepObj.preFX.addShadow()

        this.currentStepObj.on("animationcomplete", (animation, frame) => {
          this.showToast("Kneading Completed!", 3000)
          this.markStepCompleted()
          this.handleFifthStep()
        })

        this.currentStepObj.on("pointerup", () => {
          this.time.delayedCall(500, () => {
            if (kneadingStarted) {
              this.currentStepObj.stop("knead")
            }
          })
        })
      }

      this.currentStepObj.play("knead")

      this.add.particles(
        this.cameras.main.width / 2 + 20,
        this.cameras.main.height / 2 + 20,
        "flourParticle",
        {
          speed: 200,
          scaleX: 0.005,
          scaleY: 0.005,
          lifespan: 500,
          duration: 500,
        }
      )
    })
  }

  handleFifthStep() {
    this.handleSixthStep()
  }

  handleSixthStep() {
    let cuts = []
    const { x, y } = this.items.knife

    // Draw cutting guides
    const graphics = this.add.graphics()

    graphics.lineStyle(10, 0xffffff, 0.5)

    graphics.beginPath()
    graphics.moveTo(
      this.cameras.main.width / 2 - 200,
      this.cameras.main.height / 2
    )
    graphics.lineTo(
      this.cameras.main.width / 2 + 200,
      this.cameras.main.height / 2
    )
    graphics.moveTo(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 200
    )
    graphics.lineTo(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 200
    )
    graphics.strokePath()

    let cuttingLine = this.add.graphics({
      lineStyle: { width: 4, color: 0xff0000 },
    })

    let isCutting = false
    let lastPointerPosition = null

    this.input.on("pointerdown", (pointer) => {
      isCutting = true
      lastPointerPosition = { x: pointer.x, y: pointer.y }
    })

    // Handle pointer move (draw cutting line)
    this.input.on("pointermove", (pointer) => {
      if (!isCutting) return

      cuttingLine.clear()
      cuttingLine.lineBetween(
        lastPointerPosition.x,
        lastPointerPosition.y,
        pointer.x,
        pointer.y
      )
      cuttingLine.strokePath()

      const cuttingSegment = new Phaser.Geom.Line(
        lastPointerPosition.x,
        lastPointerPosition.y,
        pointer.x,
        pointer.y
      )
      if (
        Phaser.Geom.Intersects.LineToRectangle(
          cuttingSegment,
          this.currentStepObj.getBounds()
        )
      ) {
        this.currentStepObj.setTint(0xffcccc)
        this.items.knife.setOrigin(0, 0.5)
        this.items.knife.x = pointer.x + 10
        this.items.knife.y = pointer.y + 10
      }
    })

    this.input.on("pointerup", () => {
      isCutting = false
      lastPointerPosition = null
      cuts.push(cuttingLine)
      if (cuts.length === 2) {
        this.showToast("Cutting Completed!", 3000)
        this.markStepCompleted()
        this.handleSeventhStep()
        cuts[0].destroy()
        cuts[1].destroy()
        graphics.destroy()
        this.currentStepObj.destroy()
        for (let i = 0; i < 4; i++) {
          this.currentStepObj = this.add.group()
          const slice = this.add.image(
            this.cameras.main.width / 2 + 20,
            this.cameras.main.height / 2 + 20,
            "slice" + (i + 1)
          )
          slice.setOrigin(0.5, 0.5)
          slice.setScale(400 / slice.width)
          this.currentStepObj.add(slice)
          this.tweens.add({
            targets: slice,
            x: this.cameras.main.width / 2 + (i === 0 || i === 3 ? -20 : 40),
            y: this.cameras.main.height / 2 + (i === 0 || i === 1 ? -20 : 40),
            duration: 500,
            ease: "Power2",
          })
          this.items.knife.setOrigin(0.5, 0.5)
          this.tweens.add({
            targets: this.items.knife,
            x,
            y,
            duration: 500,
            ease: "Power2",
          })
          this.markStepCompleted()
          this.addSparkle()
        }

        return
      }
      cuttingLine = this.add.graphics({
        lineStyle: { width: 4, color: 0xff0000 },
      })
      this.currentStepObj.clearTint()
      this.items.knife.setOrigin(0.5, 0.5)
      this.tweens.add({
        targets: this.items.knife,
        x,
        y,
        duration: 500,
        ease: "Power2",
      })
    })
  }

  handleSeventhStep() {}

  addSparkle(x, y, duration = 1000) {
    const sparkleSound = this.sound.add("sparkle")
    sparkleSound.play()
    const sparkleEmitter = this.add.particles(x, y, "sparkle", {
      angle: { min: -360, max: 360 },
      speed: 150,
      scaleX: 0.01,
      scaleY: 0.01,
      lifespan: 1000,
      duration,
    })
  }

  showToast(message, duration = 2000) {
    // Create a background for the toast (optional)
    const toastBg = this.add
      .rectangle(
        this.cameras.main.centerX,
        this.cameras.main.height - 100,
        this.cameras.main.width - 500,
        150,
        0xe0ce8a,
        1
      )
      .setDepth(100)
      .setOrigin(0.5)

    // Create the text object
    const toastText = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.height - 100,
        message,
        {
          fontSize: "28px",
          color: "#000000",
          fontFamily: "PixelFont",
        }
      )
      .setDepth(100)
      .setOrigin(0.5)

    const toastGroup = this.add.group([toastBg, toastText])

    toastGroup.setY(this.cameras.main.height)

    this.tweens.add({
      targets: toastGroup.getChildren(),
      y: "-=100",
      alpha: { from: 0, to: 1 },
      duration: 300,
      ease: "Power2",
      onComplete: () => {
        this.time.delayedCall(duration, () => {
          this.tweens.add({
            targets: toastGroup.getChildren(),
            y: "+=100",
            alpha: 0,
            duration: 300,
            ease: "Power2",
            onComplete: () => {
              toastGroup.destroy(true)
            },
          })
        })
      },
    })
  }
}
