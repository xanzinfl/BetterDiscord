/**
 * @name No Webcam Invert
 * @author xanzinfl
 * @authorId 888591350986047508
 * @version 1.0.2
 * @description Removes the local invert on your camera feed
 * @source https://github.com/xanzinfl/BetterDiscord/blob/main/Plugins/NoWebcamInvert
 * @updateUrl https://github.com/xanzinfl/BetterDiscord/blob/main/Plugins/NoWebcamInvert/NoWebcamInvert.plugin.js
 */

let isInverted = false;  // Variable to track the inversion state

// Function to toggle inversion of your camera
function toggleCameraInversion() {
  isInverted = !isInverted;  // Toggle the state

  // Target the video inside the div with class "mirror_a5989d"
  const myCamera = document.querySelector('.mirror_a5989d video');

  if (myCamera) {
    // Apply inversion based on the state
    myCamera.style.transform = isInverted ? 'scaleX(1)' : 'scaleX(-1)';
  }
}

// Function to insert the toggle button into Discord's UI
function insertToggleButton() {
  // Look for the container where the camera controls are located
  const controlPanel = document.querySelector('.buttons-3JBrkn');  // Replace this with the correct class name

  if (controlPanel) {
    const toggleButton = document.createElement('button');
    toggleButton.innerText = 'Toggle Camera Inversion';
    toggleButton.style.margin = '5px';
    toggleButton.onclick = toggleCameraInversion;

    // Append the button to the control panel
    controlPanel.appendChild(toggleButton);
  }
}

// Continuously check if the camera feed exists and apply the inversion if needed
setInterval(() => {
  const myCamera = document.querySelector('.mirror_a5989d video');
  if (myCamera) {
    myCamera.style.transform = isInverted ? 'scaleX(1)' : 'scaleX(-1)';
  }
}, 2000);

// Insert the button on page load
insertToggleButton();
