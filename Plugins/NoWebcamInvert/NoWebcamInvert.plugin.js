/**
 * @name NoWebcamInvert
 * @author xanzinfl
 * @authorId 888591350986047508
 * @version 1.0.5
 * @description Removes the local invert on your camera feed
 * @source https://github.com/xanzinfl/BetterDiscord/blob/main/Plugins/NoWebcamInvert
 * @updateUrl https://github.com/xanzinfl/BetterDiscord/blob/main/Plugins/NoWebcamInvert/NoWebcamInvert.plugin.js
 */

module.exports = class NoWebcamInvert {
  constructor() {
    this.isInverted = false;
    this.observer = null;
  }

  start() {
    console.log('Plugin started');
    this.addInvertCheckbox();
    this.applyInversionToMyCamera();
  }

  stop() {
    this.resetCameraInversion();
    this.removeInvertCheckbox();  // Remove the checkbox when plugin stops
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  toggleCameraInversion() {
    this.isInverted = !this.isInverted;
    console.log('Toggling inversion:', this.isInverted);

    // Apply or reset inversion to your camera only once when the state changes
    this.applyInversionToMyCamera();
  }

  applyInversionToMyCamera() {
    const myCamera = document.querySelector('.mirror_a5989d video');
    if (myCamera) {
      // Apply the transform only when the checkbox is checked, otherwise reset
      myCamera.style.transform = this.isInverted ? 'scaleX(-1)' : '';
    } else {
      console.log('No camera with mirror class found.');
    }
  }

  addInvertCheckbox() {
    const addCheckbox = () => {
      const cameraSelectionContainer = document.querySelector('#video-device-context');

      if (cameraSelectionContainer) {
        // Check if the checkbox already exists
        if (!document.getElementById('invertCheckbox')) {
          const invertCheckboxContainer = document.createElement('div');
          invertCheckboxContainer.style.padding = '5px';
          invertCheckboxContainer.id = 'invertCheckboxContainer'; // Add an ID to the container for easy removal

          const invertCheckbox = document.createElement('input');
          invertCheckbox.type = 'checkbox';
          invertCheckbox.id = 'invertCheckbox';
          invertCheckbox.checked = !this.isInverted;
          invertCheckbox.onchange = () => this.toggleCameraInversion();

          const label = document.createElement('label');
          label.htmlFor = 'invertCheckbox';
          label.innerText = 'Invert';

          invertCheckboxContainer.appendChild(invertCheckbox);
          invertCheckboxContainer.appendChild(label);

          // Append the checkbox to the camera selection tab
          cameraSelectionContainer.appendChild(invertCheckboxContainer);
        }
      }
    };

    // Initial attempt to add checkbox
    addCheckbox();

    // Use MutationObserver to add checkbox if tab loads later
    this.observer = new MutationObserver(() => addCheckbox());
    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  removeInvertCheckbox() {
    const checkboxContainer = document.getElementById('invertCheckboxContainer');
    if (checkboxContainer) {
      checkboxContainer.remove(); // Remove the checkbox container when stopping the plugin
    }
  }

  resetCameraInversion() {
    const myCamera = document.querySelector('.mirror_a5989d video');
    if (myCamera) {
      myCamera.style.transform = '';  // Reset the camera inversion completely when stopping the plugin
    }
  }
};
