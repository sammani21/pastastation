import { Scene } from "phaser"

export class GameOver extends Scene {
  constructor() {
    super("GameOver")
  }

  create() {
    this.add.text(300, 100, "Game Over!", {
      fontSize: "32px",
      color: "#ff0000",
    })

    const restartButton = this.add
      .text(350, 300, "Play Again", { fontSize: "20px", color: "#fff" })
      .setInteractive()

    restartButton.on("pointerdown", () => {
      this.scene.start("MainMenu") // Go back to Main Menu
    })
  }
}
