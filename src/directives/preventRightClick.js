// src/directives/preventRightClick.js
export default {
    mounted(el) {
      el.addEventListener('contextmenu', preventContextMenu);
    },
    unmounted(el) {
      el.removeEventListener('contextmenu', preventContextMenu);
    },
  };
  
  function preventContextMenu(event) {
    event.preventDefault();
  }