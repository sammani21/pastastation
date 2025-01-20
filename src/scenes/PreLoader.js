export class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader")
  }

  preload() {
    this.load.audio("hover", "assets/sound-effects/hover.wav")
    this.load.audio("start", "assets/sound-effects/start.wav")
    this.load.audio("select", "assets/sound-effects/select.wav")
    this.load.audio("bgm", "assets/sound-effects/bgm.mp3")
    this.load.audio("wrongOption", "assets/sound-effects/wrong-option.wav")
    this.load.audio("sparkle", "assets/sound-effects/sparkle.wav")

    this.load.image("soundIcon", "assets/headphones.png")
    this.load.image("muteIcon", "assets/mute.png")
    this.load.image("plank", "assets/plank.png")
  }

  create() {
    const bgm = this.sound.add("bgm")
    bgm.play({ loop: true, volume: 0.8 })
    this.scene.start("MainMenu")
  }
}
