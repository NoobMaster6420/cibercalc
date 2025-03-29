// JavaScript para la página de Juegos de Historia

// Cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos del DOM
  const playButtons = document.querySelectorAll('.play-btn');
  const loginRequired = document.getElementById('login-required');
  const loginRequiredBtn = document.getElementById('login-required-btn');
  const comingSoonModal = document.getElementById('coming-soon-modal');
  const closeSoonModalBtn = document.getElementById('close-soon-modal');
  const closeSoonBtn = document.getElementById('close-soon-btn');
  
  // Verificar si el usuario ha iniciado sesión
  function checkUserLoggedIn() {
    const user = storage.getUser();
    
    if (!user) {
      // Si no hay usuario logueado, mostrar mensaje
      loginRequired.classList.remove('hidden');
    } else {
      // Si hay usuario logueado, ocultar mensaje
      loginRequired.classList.add('hidden');
    }
  }
  
  // Función para mostrar modal de próximamente
  function showComingSoonModal() {
    comingSoonModal.classList.remove('hidden');
  }
  
  // Función para ocultar modal de próximamente
  function hideComingSoonModal() {
    comingSoonModal.classList.add('hidden');
  }
  
  // Event Listeners
  
  // Botones de jugar
  playButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const scenarioId = button.getAttribute('data-scenario');
      
      // Verificar si el usuario está logueado
      const user = storage.getUser();
      if (!user) {
        // Si no hay usuario logueado, mostrar mensaje
        loginRequired.classList.remove('hidden');
        e.preventDefault();
        return;
      }
      
      // Por ahora, mostrar mensaje de "próximamente" para todos los escenarios
      showComingSoonModal();
      e.preventDefault();
    });
  });
  
  // Botón de iniciar sesión requerido
  loginRequiredBtn.addEventListener('click', () => {
    // Mostrar el modal de inicio de sesión
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
      loginBtn.click();
    }
  });
  
  // Botones de cerrar modal de próximamente
  closeSoonModalBtn.addEventListener('click', hideComingSoonModal);
  closeSoonBtn.addEventListener('click', hideComingSoonModal);
  
  // Inicializar: verificar si el usuario ha iniciado sesión
  checkUserLoggedIn();
});