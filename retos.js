// JavaScript para la página de Retos

// Cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos del DOM
  const startChallengeBtn = document.getElementById('start-challenge-btn');
  const challengeContainer = document.getElementById('challenge-container');
  const resultContainer = document.getElementById('result-container');
  const gameOverContainer = document.getElementById('game-over-container');
  const loginRequired = document.getElementById('login-required');
  
  const retosLives = document.getElementById('retos-lives');
  const timeLeftEl = document.getElementById('time-left');
  const heartIcons = document.querySelectorAll('.heart-icon');
  
  const challengeText = document.getElementById('challenge-text');
  const challengeFormula = document.getElementById('challenge-formula');
  const optionInputs = document.querySelectorAll('.option-input');
  const optionItems = document.querySelectorAll('.option-item');
  const verifyBtn = document.getElementById('verify-btn');
  
  const resultHeader = document.getElementById('result-header');
  const resultTitle = document.querySelector('.result-title');
  const explanationText = document.getElementById('explanation-text');
  const pointsValue = document.getElementById('points-value');
  const nextBtn = document.getElementById('next-btn');
  
  const finalPoints = document.getElementById('final-points');
  const completedChallenges = document.getElementById('completed-challenges');
  const finalMessage = document.getElementById('final-message');
  const playAgainBtn = document.getElementById('play-again-btn');
  
  const loginRequiredBtn = document.getElementById('login-required-btn');
  
  // Constantes
  const TIMER_DURATION = 30; // segundos
  const POINTS_PER_CHALLENGE = 20;
  const MAX_LIVES = 3;
  
  // Variables del estado
  let currentChallenges = [];
  let currentChallengeIndex = 0;
  let selectedOption = null;
  let timer = null;
  let timeRemaining = TIMER_DURATION;
  let gameStats = {
    lives: MAX_LIVES,
    points: 0,
    completed: 0
  };
  
  // Verificar si el usuario ha iniciado sesión
  function checkUserLoggedIn() {
    const user = storage.getUser();
    
    if (!user) {
      // Si no hay usuario logueado, mostrar mensaje
      loginRequired.classList.remove('hidden');
    } else {
      // Si hay usuario logueado, actualizar las vidas
      loginRequired.classList.add('hidden');
      gameStats.lives = user.lives;
      updateLivesDisplay();
    }
  }
  
  // Función para actualizar el display de vidas
  function updateLivesDisplay() {
    // Actualizar el texto de vidas
    retosLives.textContent = gameStats.lives;
    
    // Actualizar los iconos de corazón
    heartIcons.forEach((icon, index) => {
      if (index < gameStats.lives) {
        icon.classList.add('active');
      } else {
        icon.classList.remove('active');
      }
    });
  }
  
  // Función para iniciar el reto
  function startChallenge() {
    // Verificar si el usuario está logueado
    const user = storage.getUser();
    if (!user) {
      loginRequired.classList.remove('hidden');
      return;
    }
    
    // Verificar si el usuario tiene vidas
    if (user.lives <= 0) {
      alert('No tienes vidas suficientes para jugar. Regresa más tarde.');
      return;
    }
    
    // Actualizar estadísticas del juego
    gameStats = {
      lives: user.lives,
      points: 0,
      completed: 0
    };
    
    // Actualizar el display de vidas
    updateLivesDisplay();
    
    // Generar retos
    generateChallenges();
    
    // Ocultar intro y mostrar el reto
    document.querySelector('.retos-intro').classList.add('hidden');
    challengeContainer.classList.remove('hidden');
    
    // Mostrar el primer reto
    showChallenge(0);
    
    // Iniciar el temporizador
    startTimer();
  }
  
  // Función para generar retos
  function generateChallenges() {
    // En un entorno real, los retos vendrían de una API o base de datos
    // Aquí generamos retos ficticios para demo
    
    // Reiniciar el arreglo de retos
    currentChallenges = [
      {
        id: 1,
        question: "¿Cuál es la derivada de la siguiente función?",
        formula: "$$f(x) = 3x^5 - 2x^3 + 4x - 1$$",
        options: [
          { id: "A", formula: "$$f'(x) = 15x^4 - 6x^2 + 4$$" },
          { id: "B", formula: "$$f'(x) = 15x^4 - 6x^2 - 4$$" },
          { id: "C", formula: "$$f'(x) = 3x^4 - 2x^2 + 4$$" },
          { id: "D", formula: "$$f'(x) = 3x^5 - 2x^3 + 4$$" }
        ],
        correctOptionId: "A",
        explanation: "Para derivar la función f(x) = 3x^5 - 2x^3 + 4x - 1, aplicamos la regla de la derivada de la suma y la regla de la potencia a cada término:<br><br>f'(x) = 3·5x^4 - 2·3x^2 + 4·1 - 0 = 15x^4 - 6x^2 + 4"
      },
      {
        id: 2,
        question: "Encuentra la derivada de la función:",
        formula: "$$f(x) = \\sin(2x)$$",
        options: [
          { id: "A", formula: "$$f'(x) = 2\\cos(2x)$$" },
          { id: "B", formula: "$$f'(x) = \\cos(2x)$$" },
          { id: "C", formula: "$$f'(x) = 2\\sin(2x)$$" },
          { id: "D", formula: "$$f'(x) = -2\\sin(2x)$$" }
        ],
        correctOptionId: "A",
        explanation: "Aplicamos la regla de la cadena: d/dx(sin(2x)) = cos(2x) · d/dx(2x) = cos(2x) · 2 = 2cos(2x)."
      },
      {
        id: 3,
        question: "Calcula la derivada de:",
        formula: "$$f(x) = e^x \\cdot \\cos(x)$$",
        options: [
          { id: "A", formula: "$$f'(x) = e^x\\cos(x) - e^x\\sin(x)$$" },
          { id: "B", formula: "$$f'(x) = e^x(\\cos(x) - \\sin(x))$$" },
          { id: "C", formula: "$$f'(x) = e^x\\cos(x)$$" },
          { id: "D", formula: "$$f'(x) = -e^x\\sin(x)$$" }
        ],
        correctOptionId: "B",
        explanation: "Aplicamos la regla del producto: d/dx(e^x·cos(x)) = d/dx(e^x) · cos(x) + e^x · d/dx(cos(x)) = e^x · cos(x) + e^x · (-sin(x)) = e^x(cos(x) - sin(x))."
      },
      {
        id: 4,
        question: "¿Cuál es la derivada de la función?",
        formula: "$$f(x) = \\ln(x^2+1)$$",
        options: [
          { id: "A", formula: "$$f'(x) = \\frac{2x}{x^2+1}$$" },
          { id: "B", formula: "$$f'(x) = \\frac{1}{x^2+1}$$" },
          { id: "C", formula: "$$f'(x) = \\frac{2}{x}$$" },
          { id: "D", formula: "$$f'(x) = 2x$$" }
        ],
        correctOptionId: "A",
        explanation: "Aplicamos la regla de la cadena: d/dx(ln(x²+1)) = (1/(x²+1)) · d/dx(x²+1) = (1/(x²+1)) · 2x = 2x/(x²+1)."
      },
      {
        id: 5,
        question: "Encuentra la derivada de:",
        formula: "$$f(x) = \\frac{x+1}{x-1}$$",
        options: [
          { id: "A", formula: "$$f'(x) = \\frac{1}{(x-1)^2}$$" },
          { id: "B", formula: "$$f'(x) = \\frac{-2}{(x-1)^2}$$" },
          { id: "C", formula: "$$f'(x) = \\frac{2}{(x-1)^2}$$" },
          { id: "D", formula: "$$f'(x) = \\frac{x+1}{(x-1)^2}$$" }
        ],
        correctOptionId: "B",
        explanation: "Aplicamos la regla del cociente: d/dx((x+1)/(x-1)) = ((x-1) · d/dx(x+1) - (x+1) · d/dx(x-1)) / (x-1)² = ((x-1) · 1 - (x+1) · 1) / (x-1)² = (x-1-x-1) / (x-1)² = -2 / (x-1)²."
      },
      {
        id: 6,
        question: "Calcula la derivada de la función:",
        formula: "$$f(x) = x \\cdot \\sin(x)$$",
        options: [
          { id: "A", formula: "$$f'(x) = \\sin(x) + x\\cos(x)$$" },
          { id: "B", formula: "$$f'(x) = x\\cos(x)$$" },
          { id: "C", formula: "$$f'(x) = \\sin(x)$$" },
          { id: "D", formula: "$$f'(x) = \\cos(x)$$" }
        ],
        correctOptionId: "A",
        explanation: "Aplicamos la regla del producto: d/dx(x·sin(x)) = d/dx(x) · sin(x) + x · d/dx(sin(x)) = 1 · sin(x) + x · cos(x) = sin(x) + x·cos(x)."
      },
      {
        id: 7,
        question: "¿Cuál es la derivada de?",
        formula: "$$f(x) = (x^2 + 1)^3$$",
        options: [
          { id: "A", formula: "$$f'(x) = 3(x^2 + 1)^2$$" },
          { id: "B", formula: "$$f'(x) = 6x(x^2 + 1)^2$$" },
          { id: "C", formula: "$$f'(x) = 3(x^2 + 1)^2 \\cdot 2x$$" },
          { id: "D", formula: "$$f'(x) = 3(x^2 + 1)^2 \\cdot x^2$$" }
        ],
        correctOptionId: "B",
        explanation: "Aplicamos la regla de la cadena: d/dx((x² + 1)³) = 3(x² + 1)² · d/dx(x² + 1) = 3(x² + 1)² · 2x = 6x(x² + 1)²."
      },
      {
        id: 8,
        question: "Encuentra la derivada de la función:",
        formula: "$$f(x) = \\arctan(x)$$",
        options: [
          { id: "A", formula: "$$f'(x) = \\frac{1}{1+x^2}$$" },
          { id: "B", formula: "$$f'(x) = \\frac{-1}{1+x^2}$$" },
          { id: "C", formula: "$$f'(x) = \\frac{1}{\\sqrt{1-x^2}}$$" },
          { id: "D", formula: "$$f'(x) = \\frac{1}{x}$$" }
        ],
        correctOptionId: "A",
        explanation: "La derivada de arctan(x) es: d/dx(arctan(x)) = 1/(1+x²)."
      },
      {
        id: 9,
        question: "Calcula la derivada de:",
        formula: "$$f(x) = \\sec(x)$$",
        options: [
          { id: "A", formula: "$$f'(x) = \\sec(x) \\cdot \\tan(x)$$" },
          { id: "B", formula: "$$f'(x) = -\\sec(x) \\cdot \\tan(x)$$" },
          { id: "C", formula: "$$f'(x) = \\sec^2(x)$$" },
          { id: "D", formula: "$$f'(x) = \\tan(x)$$" }
        ],
        correctOptionId: "A",
        explanation: "La derivada de la función secante es: d/dx(sec(x)) = sec(x) · tan(x)."
      },
      {
        id: 10,
        question: "¿Cuál es la derivada de la función?",
        formula: "$$f(x) = \\sqrt{x} = x^{1/2}$$",
        options: [
          { id: "A", formula: "$$f'(x) = \\frac{1}{2\\sqrt{x}}$$" },
          { id: "B", formula: "$$f'(x) = \\frac{1}{\\sqrt{x}}$$" },
          { id: "C", formula: "$$f'(x) = 2\\sqrt{x}$$" },
          { id: "D", formula: "$$f'(x) = \\frac{1}{2x}$$" }
        ],
        correctOptionId: "A",
        explanation: "La derivada de √x = x^(1/2) es (1/2)x^(-1/2) = 1/(2√x), usando la regla de la potencia d/dx(x^n) = n·x^(n-1)."
      }
    ];
    
    // Barajar los retos
    shuffleArray(currentChallenges);
  }
  
  // Función para barajar un array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // Función para mostrar un reto
  function showChallenge(index) {
    // Verificar si hay más retos
    if (index >= currentChallenges.length) {
      // No hay más retos, mostrar fin del juego
      showGameOver();
      return;
    }
    
    // Actualizar el índice de reto actual
    currentChallengeIndex = index;
    
    // Obtener el reto actual
    const challenge = currentChallenges[index];
    
    // Mostrar texto del reto
    challengeText.textContent = challenge.question;
    
    // Mostrar fórmula del reto
    challengeFormula.innerHTML = `<p class="math">${challenge.formula}</p>`;
    
    // Mostrar opciones
    challenge.options.forEach((option, i) => {
      const optionLabel = document.getElementById(`option-${option.id}-formula`);
      optionLabel.innerHTML = `<p class="math">${option.formula}</p>`;
      
      // Reiniciar selección
      const optionInput = document.getElementById(`option-${option.id}`);
      optionInput.checked = false;
    });
    
    // Reiniciar selección y botón de verificar
    selectedOption = null;
    verifyBtn.disabled = true;
    
    // Reiniciar temporizador
    resetTimer();
    
    // Renderizar fórmulas matemáticas
    if (window.renderMathInElement) {
      renderMathInElement(challengeFormula, {
        delimiters: [
          {left: "$$", right: "$$", display: true},
          {left: "\\[", right: "\\]", display: true},
          {left: "$", right: "$", display: false},
          {left: "\\(", right: "\\)", display: false}
        ],
        throwOnError: false
      });
      
      document.querySelectorAll('.option-content').forEach(el => {
        renderMathInElement(el, {
          delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "\\[", right: "\\]", display: true},
            {left: "$", right: "$", display: false},
            {left: "\\(", right: "\\)", display: false}
          ],
          throwOnError: false
        });
      });
    }
  }
  
  // Función para iniciar el temporizador
  function startTimer() {
    timeRemaining = TIMER_DURATION;
    timeLeftEl.textContent = timeRemaining;
    
    clearInterval(timer);
    timer = setInterval(() => {
      timeRemaining--;
      timeLeftEl.textContent = timeRemaining;
      
      if (timeRemaining <= 10) {
        timeLeftEl.style.color = '#ef4444'; // Rojo cuando queda poco tiempo
      } else {
        timeLeftEl.style.color = ''; // Color por defecto
      }
      
      if (timeRemaining <= 0) {
        // Se acabó el tiempo
        clearInterval(timer);
        verifyAnswer(true);
      }
    }, 1000);
  }
  
  // Función para reiniciar el temporizador
  function resetTimer() {
    clearInterval(timer);
    timeRemaining = TIMER_DURATION;
    timeLeftEl.textContent = timeRemaining;
    timeLeftEl.style.color = ''; // Color por defecto
    startTimer();
  }
  
  // Función para verificar la respuesta
  function verifyAnswer(timedOut = false) {
    // Pausar el temporizador
    clearInterval(timer);
    
    // Obtener el reto actual
    const challenge = currentChallenges[currentChallengeIndex];
    
    // Verificar si la respuesta es correcta
    const isCorrect = !timedOut && selectedOption === challenge.correctOptionId;
    
    // Actualizar estadísticas
    if (isCorrect) {
      gameStats.points += POINTS_PER_CHALLENGE;
      gameStats.completed++;
      
      // Si el usuario está autenticado, actualizar sus puntos
      const user = storage.getUser();
      if (user) {
        const newPoints = user.points + POINTS_PER_CHALLENGE;
        storage.updateUserPoints(user.username, newPoints);
      }
    } else {
      // Restar una vida
      gameStats.lives--;
      
      // Si el usuario está autenticado, actualizar sus vidas
      const user = storage.getUser();
      if (user) {
        const newLives = Math.max(0, user.lives - 1);
        storage.updateUserLives(user.username, newLives);
      }
      
      // Actualizar el display de vidas
      updateLivesDisplay();
      
      // Si no quedan vidas, terminar el juego
      if (gameStats.lives <= 0) {
        showGameOver();
        return;
      }
    }
    
    // Mostrar resultado
    showResult(isCorrect, challenge);
  }
  
  // Función para mostrar el resultado
  function showResult(isCorrect, challenge) {
    // Ocultar el reto y mostrar el resultado
    challengeContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    
    // Actualizar el encabezado del resultado
    if (isCorrect) {
      resultHeader.className = 'result-header correct';
      resultTitle.textContent = '¡Correcto!';
      resultHeader.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <h2 class="result-title">¡Correcto!</h2>
      `;
    } else {
      resultHeader.className = 'result-header incorrect';
      resultTitle.textContent = 'Incorrecto';
      resultHeader.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <h2 class="result-title">Incorrecto</h2>
      `;
    }
    
    // Mostrar explicación
    explanationText.innerHTML = challenge.explanation;
    
    // Mostrar puntos ganados
    pointsValue.textContent = isCorrect ? `+${POINTS_PER_CHALLENGE}` : '0';
    
    // Cambiar texto del botón según si quedan vidas o no
    if (gameStats.lives <= 0) {
      nextBtn.textContent = 'Ver Resumen';
    } else {
      nextBtn.textContent = 'Siguiente Reto';
    }
    
    // Renderizar fórmulas matemáticas en la explicación
    if (window.renderMathInElement) {
      renderMathInElement(explanationText, {
        delimiters: [
          {left: "$$", right: "$$", display: true},
          {left: "\\[", right: "\\]", display: true},
          {left: "$", right: "$", display: false},
          {left: "\\(", right: "\\)", display: false}
        ],
        throwOnError: false
      });
    }
  }
  
  // Función para mostrar el fin del juego
  function showGameOver() {
    // Ocultar el resultado y mostrar el fin del juego
    resultContainer.classList.add('hidden');
    challengeContainer.classList.add('hidden');
    gameOverContainer.classList.remove('hidden');
    
    // Actualizar estadísticas
    finalPoints.textContent = gameStats.points;
    completedChallenges.textContent = gameStats.completed;
    
    // Mensaje personalizado según la puntuación
    if (gameStats.points >= 100) {
      finalMessage.textContent = '¡Increíble! Has demostrado ser un maestro del cálculo. ¡Sigue así!';
    } else if (gameStats.points >= 60) {
      finalMessage.textContent = '¡Buen trabajo! Tienes un buen dominio de las derivadas. Sigue practicando para mejorar.';
    } else if (gameStats.points > 0) {
      finalMessage.textContent = 'Has obtenido algunos puntos. Sigue practicando y mejorando tus habilidades en derivadas.';
    } else {
      finalMessage.textContent = 'No te rindas. Revisa la teoría de derivadas y vuelve a intentarlo. ¡La práctica hace al maestro!';
    }
  }
  
  // Event listeners
  
  // Botón de iniciar reto
  startChallengeBtn.addEventListener('click', startChallenge);
  
  // Selección de opciones
  optionItems.forEach(item => {
    item.addEventListener('click', () => {
      const optionId = item.getAttribute('data-option');
      selectedOption = optionId;
      verifyBtn.disabled = false;
    });
  });
  
  // Botón de verificar respuesta
  verifyBtn.addEventListener('click', () => {
    if (selectedOption) {
      verifyAnswer();
    }
  });
  
  // Botón de siguiente reto
  nextBtn.addEventListener('click', () => {
    if (gameStats.lives <= 0) {
      // Mostrar fin del juego si no quedan vidas
      showGameOver();
    } else {
      // Mostrar siguiente reto
      showChallenge(currentChallengeIndex + 1);
      // Ocultar resultado y mostrar el reto
      resultContainer.classList.add('hidden');
      challengeContainer.classList.remove('hidden');
    }
  });
  
  // Botón de jugar de nuevo
  playAgainBtn.addEventListener('click', () => {
    // Ocultar fin del juego y mostrar intro
    gameOverContainer.classList.add('hidden');
    document.querySelector('.retos-intro').classList.remove('hidden');
    
    // Actualizar las vidas del usuario en la UI
    const user = storage.getUser();
    if (user) {
      retosLives.textContent = user.lives;
    }
  });
  
  // Botón de iniciar sesión requerido
  loginRequiredBtn.addEventListener('click', () => {
    // Mostrar el modal de inicio de sesión
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
      loginBtn.click();
    }
  });
  
  // Verificar si el usuario ha iniciado sesión al cargar la página
  checkUserLoggedIn();
});