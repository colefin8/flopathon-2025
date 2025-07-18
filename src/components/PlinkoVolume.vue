<script setup>
const openLink = () => {
  window.open('https://fresco-gains-93721323.figma.site', '_blank');
};
</script>

<template>
  <!-- The main wrapper for our truly awful 90s webpage -->
  <div class="website-wrapper">
    <!-- Center tag for that classic, non-responsive 90s alignment -->
    <center>
      <!-- Table layout, because divs were too modern! -->
      <table border="5" cellspacing="0" cellpadding="15" width="80%" bgcolor="#CCFFCC">
        <tr>
          <!-- Header cell with a truly garish background and font -->
          <td align="center" bgcolor="#FFFF99">
            <font face="Comic Sans MS" size="7" color="#FF00FF">
              <!-- The indispensable marquee tag for scrolling text! -->
              <h1><marquee behavior="alternate" direction="left" scrollamount="5">WELCOME TO MY AWESOME HOMEPAGE!</marquee></h1>
            </font>
          </td>
        </tr>
        <tr>
          <!-- Content cell with another clashing background -->
          <td align="center" bgcolor="#99CCFF">
            <font face="Papyrus" size="5" color="#000080">
              <p>You've found the coolest spot on the Information Superhighway!</p>
              <p>Click the super radical button below to visit a totally tubular site!</p>
            </font>
            <br>
            <!-- The button, styled to be as obnoxious as possible -->
            <button @click="openLink" class="awful-button">
              CLICK HERE FOR FUN!
            </button>
            <br><br>
            <!-- A blinking "Under Construction" GIF placeholder, animated with CSS -->
            <img src="https://placehold.co/320x240/FF0000/FFFFFF?text=UNDER+CONSTRUCTION" alt="Under Construction" border="3" style="animation: blink 1s infinite;">
            <br><br>
            <font face="Arial Black" size="2" color="#800000">
              <p>Best viewed with Netscape Navigator 4.0 or Internet Explorer 5.0!</p>
              <p>This site is always <span style="color: #008000; font-weight: bold;">UNDER CONSTRUCTION</span>! Check back often!</p>
            </font>
            <br>
            <!-- Classic 90s web badges/buttons -->
            <img src="https://placehold.co/88x31/0000FF/FFFFFF?text=BEST+VIEWED" alt="Best Viewed" border="0">
            <img src="https://placehold.co/88x31/FF00FF/FFFFFF?text=GEOCITIES" alt="Geocities" border="0">
            <img src="https://placehold.co/88x31/00FF00/FFFFFF?text=WEB+RING" alt="Web Ring" border="0">
          </td>
        </tr>
        <tr>
          <!-- Footer cell with more retro charm -->
          <td align="center" bgcolor="#FFFF99">
            <font face="Times New Roman" size="2" color="#000000">
              <p>&copy; 1998 My Awesome Site. All Rights Reserved. Don't steal my graphics!</p>
              <!-- The ever-present, totally fake hit counter -->
              <p>You are visitor number: <span style="color:red; font-size: 2em; font-weight: bold;">987654321</span></p>
            </font>
          </td>
        </tr>
      </table>
    </center>
  </div>
</template>

<style scoped>
/* The background of the entire page, with a tiled pattern */
.website-wrapper {
  background-color: #000080; /* Dark blue background */
  background-image: url('https://placehold.co/20x20/00FF00/000000?text=.'); /* Tiled green dot pattern */
  background-repeat: repeat;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align to top to simulate old web pages */
  overflow: auto; /* Allow scrolling if content overflows */
}

/* Styling for the main button to make it look truly awful */
.awful-button {
  background-color: #FF00FF; /* Bright Magenta */
  color: #00FFFF; /* Cyan text */
  font-family: 'Impact', sans-serif; /* Loud, blocky font */
  font-size: 2.5em; /* Huge text */
  padding: 20px 40px;
  border: 8px outset #FFFF00; /* Yellow outset border for bevel effect */
  border-radius: 0; /* No rounded corners, very 90s */
  box-shadow: 10px 10px 0px #800080; /* Purple shadow for depth */
  text-shadow: 3px 3px 0px #000000; /* Black text shadow for readability (or lack thereof) */
  cursor: help; /* A weird, unexpected cursor */
  transition: all 0.1s ease-in-out;
  animation: pulse 1.5s infinite; /* Pulsing animation for extra annoyance */
}

/* Hover effect for the awful button */
.awful-button:hover {
  background-color: #00FFFF; /* Swap colors on hover */
  color: #FF00FF;
  border: 8px inset #FFFF00; /* Inset border on hover */
  box-shadow: 5px 5px 0px #800080;
}

/* Keyframe animation for the pulsing button */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Keyframe animation for the blinking "Under Construction" image */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Basic styling for images to prevent overflow but maintain awful aesthetic */
img {
  max-width: 100%; /* Prevent images from breaking the table layout */
  height: auto;
}
</style>
