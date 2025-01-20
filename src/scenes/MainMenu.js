export class MainMenu extends Phaser.Scene {
  constructor() {
    super("MainMenu")
  }

  preload() {
    this.load.image("background", "assets/bg.png")
    this.load.image("title", "assets/title.png")
    this.load.image("level1", "assets/fettuccine.png")
    this.load.image("level2", "assets/farfalle.png")
    this.load.image("level3", "assets/rigatoni.png")
    this.load.image("level4", "assets/ravioli.png")
    this.load.image("lock", "assets/lock.png")
    this.load.image("title-bg", "assets/title-bg.png")
  }

  create() {
    const hoverSound = this.sound.add("hover")
    const startSound = this.sound.add("start")
    const selectSound = this.sound.add("select")

    const bg = this.add.image(0, 0, "background")
    bg.setOrigin(0, 0)
    bg.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height) // Scale to fit

    const titleBg = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.width / 4,
      "title-bg"
    )
    titleBg.setOrigin(0.5, 0.5).setScale(800 / titleBg.width)

    const title = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.width / 4 - 50,
        "pasta-nation",
        {
          fontFamily: "PixelFont",
          fontSize: "72px",
          color: "#000000",
        }
      )
      .setOrigin(0.5, 0.5)
      .setShadow(2, 2, "#ffffff", 4, false, true)

    const subtitle = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.width / 4 + 20,
        "your handcrafted pasta\njourney begins here!",
        {
          fontFamily: "PixelFont",
          textAlign: "center",
          fontSize: "32px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5, 0.5)
      .setShadow(1, 1, "#000000", 2, false, true)

    const levelTileWidth = 550
    const levelTileScale = levelTileWidth / this.cameras.main.width

    const levels = []
    const levelLabels = ["fettuccine", "farfalle", "rigatoni", "ravioli"]

    for (let i = 0; i < 4; i++) {
      const level = this.add
        .image(
          ((i + 1) * this.cameras.main.width) / 5,
          (2 * this.cameras.main.height) / 3,
          `level${i + 1}`
        )
        .setInteractive()
      level.setScale(levelTileScale)
      level.preFX.addShadow()
      levels.push(level)

      const plank = this.add.image(
        ((i + 1) * this.cameras.main.width) / 5,
        (2 * this.cameras.main.height) / 3 + 200,
        "plank"
      )
      plank.setScale(0.15)
      plank.preFX.addShadow()

      const label = this.add.text(
        ((i + 1) * this.cameras.main.width) / 5,
        (2 * this.cameras.main.height) / 3 + 200,
        levelLabels[i],
        {
          fontFamily: "PixelFont",
          fontSize: "26px",
          color: "#ffffff",
        }
      )
      label.setOrigin(0.5, 0.5)
      label.setShadow(1, 1, "#000000", 3, false, true)
    }

    for (let i = 0; i < 4; i++) {
      const group = this.add.group()
      const level = levels[i]
      group.add(level)
      if (i !== 0) {
        const lock = this.add.image(
          ((i + 1) * this.cameras.main.width) / 5,
          (2 * this.cameras.main.height) / 3,
          "lock"
        )
        lock.setScale(0.15)
        levels[i].setTint(0x808080)
        group.add(lock)
      }
      level.on("pointerover", () => {
        level.setScale(levelTileScale + 0.02)
        hoverSound.play()
      })

      level.on("pointerout", () => {
        level.setScale(levelTileScale)
      })
    }

    levels[0].on("pointerdown", () => {
      startSound.play()
      this.scene.start("Level1")
    })

    const muteIcon = this.add.image(100, 100, "muteIcon")
    muteIcon.setInteractive()
    muteIcon.setScale(0.1)
    muteIcon.setVisible(false)

    muteIcon.on("pointerdown", () => {
      this.sound.mute = false
      selectSound.play()
      muteIcon.setVisible(false)
      soundIcon.setVisible(true)
    })

    const soundIcon = this.add.image(100, 100, "soundIcon")
    soundIcon.setInteractive()
    soundIcon.setScale(0.1)

    soundIcon.on("pointerdown", () => {
      selectSound.play()
      this.sound.mute = true
      muteIcon.setVisible(true)
      soundIcon.setVisible(false)
    })
  }
}
