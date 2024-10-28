/**
 * @name NoWebcamInvert
 * @author xanzinfl
 * @authorId 888591350986047508
 * @version 1.0.7
 * @description Allows you to toggle the local invert on your camera feed
 * @invite svSmDEvZQw
 * @source https://github.com/xanzinfl/BetterDiscord/blob/main/Plugins/NoWebcamInvert
 * @updateUrl https://raw.githubusercontent.com/xanzinfl/BetterDiscord/main/Plugins/NoWebcamInvert/NoWebcamInvert.plugin.js
 */

module.exports = class NoWebcamInvert {
  constructor() {
    this.isInverted = true;
    this.observer = null;
  }

  start() {
    console.log('Plugin started');
    this.addInvertCheckbox();
    this.applyInversionToMyCamera();
    this.monitorCamera();
  }

  stop() {
    this.resetCameraInversion();
    this.removeInvertCheckbox();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  toggleCameraInversion() {
    this.isInverted = !this.isInverted;
    console.log('Toggling inversion:', !this.isInverted);


    this.applyInversionToMyCamera();
  }

  applyInversionToMyCamera() {
    const myCamera = document.querySelector('.mirror_a5989d video');
    if (myCamera) {

      myCamera.style.transform = !this.isInverted ? 'scaleX(-1)' : '';
    } else {
      console.log('No camera with mirror class found.');
    }
  }

  addInvertCheckbox() {
    const addCheckbox = () => {
      const cameraSelectionContainer = document.querySelector('.groupLabel_d90b3d');

      if (cameraSelectionContainer) {

        if (!document.getElementById('invertCheckbox')) {
          const invertCheckboxContainer = document.createElement('div');
          invertCheckboxContainer.style.padding = '5px';
          invertCheckboxContainer.id = 'invertCheckboxContainer';

          const invertCheckbox = document.createElement('input');
          invertCheckbox.type = 'checkbox';
          invertCheckbox.id = 'invertCheckbox';
          invertCheckbox.checked = this.isInverted;
          invertCheckbox.onchange = () => this.toggleCameraInversion();

          const label = document.createElement('label');
          label.htmlFor = 'invertCheckbox';
          label.innerText = 'Invert';

          invertCheckboxContainer.appendChild(invertCheckbox);
          invertCheckboxContainer.appendChild(label);


          cameraSelectionContainer.appendChild(invertCheckboxContainer);
        }
      }
    };


    addCheckbox();


    this.observer = new MutationObserver(() => addCheckbox());
    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  monitorCamera() {
    setInterval(() => {

      if (!this.isInverted) {
        this.applyInversionToMyCamera();
      }
    }, 500); // Reapply every 0.5 seconds to ensure the inversion stays
  }

  removeInvertCheckbox() {
    const checkboxContainer = document.getElementById('invertCheckboxContainer');
    if (checkboxContainer) {
      checkboxContainer.remove();
    }
  }

  resetCameraInversion() {
    const myCamera = document.querySelector('.mirror_a5989d video');
    if (myCamera) {
      myCamera.style.transform = '';
    }
  }
};