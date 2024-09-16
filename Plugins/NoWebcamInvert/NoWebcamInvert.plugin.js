/**
 * @name NoWebcamInvert
 * @author xanzinfl
 * @authorId 888591350986047508
 * @version 1.0.6
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
    this.addInvertCheckbox2();
    this.applyInversionToMyCamera();
    this.monitorCamera();
  }

  stop() {
    this.resetCameraInversion();
    this.removeInvertCheckbox();
    this.removeInvertCheckbox2();
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

  addInvertCheckbox2() {
    const addCheckbox = () => {
      const cameraSelectionContainer = document.querySelector('.checkboxWrapper_f6cde8');

      if (cameraSelectionContainer) {

        if (!document.getElementById('invertCheckbox2')) {
          const invertCheckbox2Container = document.createElement('div');
          invertCheckbox2Container.style.padding = '5px';
          invertCheckbox2Container.id = 'invertCheckboxContainer';

          const invertCheckbox2 = document.createElement('input');
          invertCheckbox2.type = 'checkbox';
          invertCheckbox2.id = 'invertCheckbox2';
          invertCheckbox2.checked = this.isInverted;
          invertCheckbox2.onchange = () => this.toggleCameraInversion();

          const label = document.createElement('label');
          label.htmlFor = 'invertCheckbox2';
          label.innerText = 'Invert';

          invertCheckbox2Container.appendChild(invertCheckbox2);
          invertCheckbox2Container.appendChild(label);


          cameraSelectionContainer.appendChild(invertCheckbox2Container);
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

  removeInvertCheckbox2()  {
  const checkbox2Container = document.getElementById('invertCheckbox2Container');
    if (checkbox2Container) {
      checkbox2Container.remove();
    }
  }

  resetCameraInversion() {
    const myCamera = document.querySelector('.mirror_a5989d video');
    if (myCamera) {
      myCamera.style.transform = '';
    }
  }
};