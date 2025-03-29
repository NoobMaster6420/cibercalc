// Sistema de almacenamiento local
const storage = {
  getUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  },
  
  setUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.updateUIWithUser(user);
  },
  
  clearUser() {
    localStorage.removeItem('currentUser');
  },
  
  getUsers() {
    const usersData = localStorage.getItem('users');
    return usersData ? JSON.parse(usersData) : [];
  },
  
  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  },
  
  getUserByUsername(username) {
    const users = this.getUsers();
    return users.find(user => user.username === username);
  },
  
  updateUserPoints(username, points) {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.username === username);
    
    if (userIndex !== -1) {
      users[userIndex].points = points;
      localStorage.setItem('users', JSON.stringify(users));
      
      // Actualizar usuario actual si es necesario
      const currentUser = this.getUser();
      if (currentUser && currentUser.username === username) {
        currentUser.points = points;
        this.setUser(currentUser);
      }
      
      return users[userIndex];
    }
    
    return null;
  },
  
  updateUserLives(username, lives) {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.username === username);
    
    if (userIndex !== -1) {
      users[userIndex].lives = lives;
      localStorage.setItem('users', JSON.stringify(users));
      
      // Actualizar usuario actual si es necesario
      const currentUser = this.getUser();
      if (currentUser && currentUser.username === username) {
        currentUser.lives = lives;
        this.setUser(currentUser);
      }
      
      return users[userIndex];
    }
    
    return null;
  },
  
  updateUIWithUser(user) {
    const userStats = document.getElementById('user-stats');
    const mobileUserInfo = document.getElementById('mobile-user-info');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const mobileLoginBtn = document.getElementById('mobile-login-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    const livesCount = document.getElementById('lives-count');
    const pointsCount = document.getElementById('points-count');
    const mobileLivesCount = document.getElementById('mobile-lives-count');
    const mobilePointsCount = document.getElementById('mobile-points-count');
    const usernameDisplay = document.getElementById('username-display');
    const userInitial = document.getElementById('user-initial');
    
    if (user) {
      // Usuario logueado - mostrar stats y botón de logout
      if (userStats) userStats.classList.remove('hidden');
      if (mobileUserInfo) mobileUserInfo.classList.remove('hidden');
      if (loginBtn) loginBtn.classList.add('hidden');
      if (logoutBtn) logoutBtn.classList.remove('hidden');
      if (mobileLoginBtn) mobileLoginBtn.classList.add('hidden');
      if (mobileLogoutBtn) mobileLogoutBtn.classList.remove('hidden');
      
      // Actualizar valores
      if (livesCount) livesCount.textContent = user.lives;
      if (pointsCount) pointsCount.textContent = user.points;
      if (mobileLivesCount) mobileLivesCount.textContent = user.lives;
      if (mobilePointsCount) mobilePointsCount.textContent = user.points;
      if (usernameDisplay) usernameDisplay.textContent = user.username;
      if (userInitial) userInitial.textContent = user.username.charAt(0).toUpperCase();
    } else {
      // No hay usuario - mostrar botón de login
      if (userStats) userStats.classList.add('hidden');
      if (mobileUserInfo) mobileUserInfo.classList.add('hidden');
      if (loginBtn) loginBtn.classList.remove('hidden');
      if (logoutBtn) logoutBtn.classList.add('hidden');
      if (mobileLoginBtn) mobileLoginBtn.classList.remove('hidden');
      if (mobileLogoutBtn) mobileLogoutBtn.classList.add('hidden');
    }
  }
};

// Cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos del DOM
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const loginBtn = document.getElementById('login-btn');
  const mobileLoginBtn = document.getElementById('mobile-login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
  const authModal = document.getElementById('auth-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const modalTitle = document.getElementById('modal-title');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const switchToRegister = document.getElementById('switch-to-register');
  const switchToLogin = document.getElementById('switch-to-login');
  const submitLoginBtn = document.getElementById('submit-login');
  const submitRegisterBtn = document.getElementById('submit-register');
  
  // Función para abrir el modal
  function openModal() {
    authModal.classList.remove('hidden');
  }
  
  // Función para cerrar el modal
  function closeModalFunc() {
    authModal.classList.add('hidden');
    
    // Limpiar campos del formulario
    const inputs = authModal.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
  }
  
  // Función para alternar el menú móvil
  function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
  }
  
  // Función para cambiar entre formularios de login y registro
  function switchForms(showLogin = true) {
    if (showLogin) {
      modalTitle.textContent = 'Iniciar Sesión';
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
    } else {
      modalTitle.textContent = 'Registrarse';
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
    }
  }
  
  // Función para iniciar sesión
  function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    const user = storage.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      alert('Usuario o contraseña incorrectos');
      return;
    }
    
    // Login exitoso
    storage.setUser(user);
    closeModalFunc();
    
    // Actualizar la UI
    storage.updateUIWithUser(user);
    
    // Recargar la página si es necesario
    if (window.location.pathname.includes('ranking.html') || 
        window.location.pathname.includes('retos.html') || 
        window.location.pathname.includes('quiz.html') || 
        window.location.pathname.includes('juegos-historia.html')) {
      window.location.reload();
    }
  }
  
  // Función para registrarse
  function register() {
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    
    if (!username || !password || !confirm) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    if (password !== confirm) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    // Verificar si el usuario ya existe
    const existingUser = storage.getUserByUsername(username);
    
    if (existingUser) {
      alert('El nombre de usuario ya está en uso');
      return;
    }
    
    // Crear nuevo usuario
    const newUser = {
      username,
      password,
      points: 0,
      lives: 3
    };
    
    // Guardar el usuario
    storage.addUser(newUser);
    
    // Iniciar sesión automáticamente
    storage.setUser(newUser);
    closeModalFunc();
    
    // Actualizar la UI
    storage.updateUIWithUser(newUser);
    
    // Recargar la página si es necesario
    if (window.location.pathname.includes('ranking.html') || 
        window.location.pathname.includes('retos.html') || 
        window.location.pathname.includes('quiz.html') || 
        window.location.pathname.includes('juegos-historia.html')) {
      window.location.reload();
    }
  }
  
  // Función para cerrar sesión
  function logout() {
    storage.clearUser();
    storage.updateUIWithUser(null);
    
    // Recargar la página si es necesario
    if (window.location.pathname.includes('ranking.html') || 
        window.location.pathname.includes('retos.html') || 
        window.location.pathname.includes('quiz.html') || 
        window.location.pathname.includes('juegos-historia.html')) {
      window.location.reload();
    }
  }
  
  // Event Listeners
  
  // Menú móvil
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  // Botones de login
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      switchForms(true);
      openModal();
    });
  }
  
  if (mobileLoginBtn) {
    mobileLoginBtn.addEventListener('click', () => {
      switchForms(true);
      openModal();
    });
  }
  
  // Botones de logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
  
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener('click', logout);
  }
  
  // Cerrar modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModalFunc);
  }
  
  // Cambiar entre formularios
  if (switchToRegister) {
    switchToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      switchForms(false);
    });
  }
  
  if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      switchForms(true);
    });
  }
  
  // Submit de formularios
  if (submitLoginBtn) {
    submitLoginBtn.addEventListener('click', login);
  }
  
  if (submitRegisterBtn) {
    submitRegisterBtn.addEventListener('click', register);
  }
  
  // Cerrar modal con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !authModal.classList.contains('hidden')) {
      closeModalFunc();
    }
  });
  
  // Inicializar UI
  const currentUser = storage.getUser();
  storage.updateUIWithUser(currentUser);
});