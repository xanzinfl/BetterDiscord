/**
 * @name No Webcam Invert
 * @author xanzinfl
 * @authorId 888591350986047508
 * @version 1.0.2
 * @description Removes the local invert on your camera feed
 */

let isInverted = false;

// Function to toggle inversion of your camera
function toggleCameraInversion() {
  isInverted = !isInverted;

  // Target the video inside the div with class "mirror_a5989d"
  const myCamera = document.querySelector('.mirror_a5989d video');

  if (myCamera) {
    myCamera.style.transform = isInverted ? 'scaleX(1)' : 'scaleX(-1)';
  }
}

// Function to insert the toggle button into Discord's UI
function insertToggleButton() {
  // Look for a container in the UI where the camera controls might be
  const controlPanel = document.querySelector('.buttons-3JBrkn'); // Replace with actual class for the control panel

  if (controlPanel) {
    const toggleButton = document.createElement('button');
    toggleButton.innerText = 'Toggle Camera Inversion';
    toggleButton.style.margin = '5px';
    toggleButton.onclick = toggleCameraInversion;

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
