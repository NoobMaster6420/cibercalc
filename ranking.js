// JavaScript para la página de Ranking

// Cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos del DOM
  const leaderboardContainer = document.getElementById('leaderboard-container');
  const refreshBtn = document.getElementById('refresh-btn');
  const loginRequired = document.getElementById('login-required');
  const loginRequiredBtn = document.getElementById('login-required-btn');
  
  // Función para verificar si el usuario ha iniciado sesión
  function checkUserLoggedIn() {
    const user = storage.getUser();
    
    if (!user) {
      // Si no hay usuario logueado, mostrar mensaje
      leaderboardContainer.classList.add('hidden');
      loginRequired.classList.remove('hidden');
    } else {
      // Si hay usuario logueado, mostrar ranking
      leaderboardContainer.classList.remove('hidden');
      loginRequired.classList.add('hidden');
      // Cargar el ranking
      loadLeaderboard();
    }
  }
  
  // Función para cargar el ranking
  function loadLeaderboard() {
    // Obtener los usuarios ordenados por puntos
    const users = storage.getUsers().sort((a, b) => b.points - a.points);
    
    // Crear el contenido HTML
    let leaderboardHTML = '';
    
    if (users.length === 0) {
      // Si no hay usuarios, mostrar mensaje
      leaderboardHTML = `
        <div class="empty-state">
          No hay usuarios en el ranking todavía.
        </div>
      `;
    } else {
      // Si hay usuarios, crear la lista
      leaderboardHTML = `
        <div class="leaderboard-list">
          <div class="leaderboard-header">
            <div class="header-rank">#</div>
            <div class="header-user">Usuario</div>
            <div class="header-points">Puntos</div>
          </div>
      `;
      
      // Agregar cada usuario a la lista
      users.forEach((user, index) => {
        const rank = index + 1;
        let rankClass = '';
        
        // Asignar clases especiales a los primeros lugares
        if (rank === 1) rankClass = 'top-rank';
        else if (rank === 2) rankClass = 'top-rank-2';
        else if (rank === 3) rankClass = 'top-rank-3';
        
        // Crear el elemento de la lista
        leaderboardHTML += `
          <div class="leaderboard-item">
            <div class="rank ${rankClass}">${rank}</div>
            <div class="user-info">
              <div class="user-avatar">
                <span class="user-initial">${user.username.charAt(0).toUpperCase()}</span>
              </div>
              <div class="username">${user.username}</div>
            </div>
            <div class="points">
              <svg xmlns="http://www.w3.org/2000/svg" class="star-icon" viewBox="0 0 24 24" fill="#eab308" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              ${user.points}
            </div>
          </div>
        `;
      });
      
      leaderboardHTML += '</div>';
    }
    
    // Actualizar el contenedor
    leaderboardContainer.innerHTML = leaderboardHTML;
    
    // Resaltar al usuario actual si está logueado
    highlightCurrentUser();
  }
  
  // Función para resaltar al usuario actual en el ranking
  function highlightCurrentUser() {
    const currentUser = storage.getUser();
    
    if (!currentUser) return;
    
    // Buscar todas las filas de usuarios
    const userRows = document.querySelectorAll('.leaderboard-item');
    
    // Recorrer las filas
    userRows.forEach(row => {
      const username = row.querySelector('.username').textContent;
      
      // Si el nombre de usuario coincide con el usuario actual
      if (username === currentUser.username) {
        // Agregar clase para resaltar
        row.style.backgroundColor = 'hsla(var(--primary), 0.15)';
        row.style.borderLeft = '3px solid hsl(var(--primary))';
      }
    });
  }
  
  // Event Listener para el botón de actualizar
  refreshBtn.addEventListener('click', () => {
    loadLeaderboard();
  });
  
  // Event Listener para el botón de iniciar sesión requerido
  loginRequiredBtn.addEventListener('click', () => {
    // Mostrar el modal de inicio de sesión
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
      loginBtn.click();
    }
  });
  
  // Inicializar: verificar si el usuario ha iniciado sesión
  checkUserLoggedIn();
  
  // Verificar si se debe mostrar datos de ejemplo
  function checkForExampleData() {
    const users = storage.getUsers();
    
    // Si no hay usuarios y el usuario actual está logueado, crear algunos ejemplos
    if (users.length <= 1 && storage.getUser()) {
      // Crear usuarios de ejemplo solo si el usuario está logueado
      addExampleUsers();
      // Cargar el ranking nuevamente
      loadLeaderboard();
    }
  }
  
  // Función para agregar usuarios de ejemplo
  function addExampleUsers() {
    const exampleUsers = [
      { username: "MathWizard", password: "ejemplo123", points: 520, lives: 3 },
      { username: "DerivativeKing", password: "ejemplo123", points: 480, lives: 2 },
      { username: "NumberNinja", password: "ejemplo123", points: 375, lives: 3 },
      { username: "CalculusHero", password: "ejemplo123", points: 310, lives: 1 },
      { username: "MathGenius", password: "ejemplo123", points: 280, lives: 2 }
    ];
    
    // Obtener usuarios existentes
    const existingUsers = storage.getUsers();
    const existingUsernames = existingUsers.map(user => user.username);
    
    // Filtrar solo usuarios que no existen ya
    const newUsers = exampleUsers.filter(user => !existingUsernames.includes(user.username));
    
    // Agregar nuevos usuarios
    newUsers.forEach(user => {
      storage.addUser(user);
    });
  }
  
  // Verificar si se deben mostrar datos de ejemplo (con un pequeño retraso)
  setTimeout(checkForExampleData, 500);
});