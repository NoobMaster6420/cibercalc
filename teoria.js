// JavaScript para la página de teoría

// Esperar a que el DOM se cargue completamente
document.addEventListener('DOMContentLoaded', () => {
  // Obtener referencias a elementos del DOM
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  // Función para cambiar de pestaña
  function changeTab(tabId) {
    // Desactivar todas las pestañas
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    
    // Activar la pestaña seleccionada
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`${tabId}-content`).classList.add('active');
    
    // Guardar la pestaña actual en sessionStorage
    sessionStorage.setItem('activeTab', tabId);
  }
  
  // Agregar event listeners a los botones de pestañas
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      changeTab(tabId);
    });
  });
  
  // Verificar si hay una pestaña guardada en sessionStorage
  const savedTab = sessionStorage.getItem('activeTab');
  
  if (savedTab && document.querySelector(`[data-tab="${savedTab}"]`)) {
    changeTab(savedTab);
  }
  
  // Renderizar fórmulas matemáticas con KaTeX
  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [
        {left: "$$", right: "$$", display: true},
        {left: "\\[", right: "\\]", display: true},
        {left: "$", right: "$", display: false},
        {left: "\\(", right: "\\)", display: false}
      ],
      throwOnError: false
    });
  } else {
    // Esperar a que KaTeX se cargue y luego renderizar
    document.addEventListener('DOMContentLoaded', () => {
      if (window.renderMathInElement) {
        renderMathInElement(document.body, {
          delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "\\[", right: "\\]", display: true},
            {left: "$", right: "$", display: false},
            {left: "\\(", right: "\\)", display: false}
          ],
          throwOnError: false
        });
      }
    });
  }
});