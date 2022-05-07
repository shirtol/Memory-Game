const Sounds = function (fileName) {
  if (fileName !== undefined) {
      /**
       * @type {Audio}
       */
      this.file = new Audio(`../assets/sfx/${fileName}`);
  }
};

/**
* @class
*/
export const MediaPlayer = function () {
  /**
   * @type {Sounds}
   */
  this.bgSound = new Sounds("backsound.mp3");
  this.deal = new Sounds("deal.mp3");
  this.popUp = new Sounds("popup.flac");
  this.popUp2 = new Sounds("popup2.wav");
  this.popDown = new Sounds("popdown.wav");
  this.popDown2 = new Sounds("popdown2.wav");
  this.click = new Sounds("click.wav");
  this.flip = new Sounds("flip.wav");
  this.flipBack = new Sounds("flipBack.wav");
  this.success = new Sounds("successFlip.wav");
  this.winSound = new Sounds("win.wav");
  this.winVoice = new Sounds("winVoice.wav");
  this.scoreBoard = new Sounds("scoreBoard.wav");
  this.mute = false;


  /**
   * @description play the correct sound of the tool
   * @param {string} tile
   */
   this.playSound = (effect) => {
    if (this[effect] !== undefined) {
        this[effect].file.currentTime = 0;
        this[effect].file.muted = this.mute;
        this[effect].file.play();
    } else {
        console.warn(`This tile doesn't exists`);
    }
  };

  this.playSoundLoop = (effect) => {
      if (this[effect] !== undefined) {
          this[effect].file.currentTime = 0;
          this[effect].file.muted = this.mute;
          this[effect].file.volume = 0.4;
          this[effect].file.loop = true;
          this[effect].file.play();
      } else {
          console.warn(`This tile doesn't exists`);
      }
  };

  this.pause = (effect) => {
    this[effect].file.pause();
  };

  this.toggleMute = () => {
    this.mute = !this.mute;
    return this.mute;
  };
};

// gameState.media.mute();
// gameState.media.stop("bgSound");