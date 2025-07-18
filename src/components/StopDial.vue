<template>
  <div style="width: 100vw; height: 100vh; overflow: hidden;">
    <iframe
      :src="figmaUrl"
      title="Figma Embedded Site"
      style="width: 100%; height: 100%; border: none;"
      allowFullScreen
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'FigmaEmbed', // Component name
  data() {
    return {
      figmaUrl: "https://rise-legend-22248296.figma.site" // The URL to embed
    };
  },
  // Optional: Add a mounted hook to ensure body/html styles are applied
  mounted() {
    document.documentElement.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden'; // Prevent scrollbars from body
  },
  beforeUnmount() {
    // Clean up styles when component is unmounted (important for single-page apps)
    document.documentElement.style.height = '';
    document.body.style.margin = '';
    document.body.style.height = '';
    document.body.style.overflow = '';
  }
};
</script>

<style>
/* Ensure HTML and Body take full height and have no default margins/padding */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden; /* Prevent scrollbars on the main page */
}
</style>