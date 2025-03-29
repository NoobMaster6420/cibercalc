// JavaScript para la página de Quiz

// Cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos del DOM
  const difficultySelector = document.getElementById('difficulty-selector');
  const quizContainer = document.getElementById('quiz-container');
  const resultContainer = document.getElementById('result-container');
  const summaryContainer = document.getElementById('summary-container');
  const loginRequired = document.getElementById('login-required');
  
  const easyBtn = document.getElementById('easy-btn');
  const mediumBtn = document.getElementById('medium-btn');
  const hardBtn = document.getElementById('hard-btn');
  
  const currentQuestionEl = document.getElementById('current-question');
  const totalQuestionsEl = document.getElementById('total-questions');
  const timeLeftEl = document.getElementById('time-left');
  
  const questionText = document.getElementById('question-text');
  const questionFormula = document.getElementById('question-formula');
  const optionInputs = document.querySelectorAll('.option-input');
  const optionItems = document.querySelectorAll('.option-item');
  const verifyBtn = document.getElementById('verify-btn');
  
  const resultHeader = document.getElementById('result-header');
  const resultTitle = document.querySelector('.result-title');
  const explanationText = document.getElementById('explanation-text');
  const pointsValue = document.getElementById('points-value');
  const nextBtn = document.getElementById('next-btn');
  
  const correctCount = document.getElementById('correct-count');
  const incorrectCount = document.getElementById('incorrect-count');
  const totalPoints = document.getElementById('total-points');
  
  const retryBtn = document.getElementById('retry-btn');
  const loginRequiredBtn = document.getElementById('login-required-btn');
  
  // Constantes 
  const TOTAL_QUESTIONS = 10;
  const TIMER_DURATION = 60; // segundos
  
  // Variables del estado
  let currentQuestions = [];
  let currentQuestionIndex = 0;
  let selectedOption = null;
  let timer = null;
  let timeRemaining = TIMER_DURATION;
  let difficulty = null;
  let pointsPerQuestion = 0;
  let quizStats = {
    correct: 0,
    incorrect: 0,
    points: 0
  };
  
  // Verificar si el usuario ha iniciado sesión
  const checkUserLoggedIn = () => {
    const user = storage.getUser();
    if (!user) {
      // Mostrar mensaje de inicio de sesión requerido
      difficultySelector.classList.add('hidden');
      quizContainer.classList.add('hidden');
      resultContainer.classList.add('hidden');
      summaryContainer.classList.add('hidden');
      loginRequired.classList.remove('hidden');
    } else {
      // Mostrar selector de dificultad
      difficultySelector.classList.remove('hidden');
      loginRequired.classList.add('hidden');
    }
  };
  
  // Función para iniciar el quiz
  const startQuiz = (selectedDifficulty) => {
    difficulty = selectedDifficulty;
    
    // Asignar puntos por pregunta según la dificultad
    switch (difficulty) {
      case 'easy':
        pointsPerQuestion = 5;
        break;
      case 'medium':
        pointsPerQuestion = 10;
        break;
      case 'hard':
        pointsPerQuestion = 15;
        break;
      default:
        pointsPerQuestion = 5;
    }
    
    // Generar preguntas según la dificultad
    generateQuestions(difficulty);
    
    // Ocultar selector de dificultad y mostrar el quiz
    difficultySelector.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    
    // Actualizar contador de preguntas
    totalQuestionsEl.textContent = TOTAL_QUESTIONS;
    
    // Mostrar la primera pregunta
    showQuestion(0);
    
    // Iniciar el temporizador
    startTimer();
  };
  
  // Función para generar preguntas
  const generateQuestions = (difficulty) => {
    // En un entorno real, las preguntas vendrían de una API o base de datos
    // Aquí generamos preguntas ficticias para demo
    
    // Reiniciar el arreglo de preguntas
    currentQuestions = [];
    
    // Diferentes conjuntos de preguntas según la dificultad
    if (difficulty === 'easy') {
      currentQuestions = [
        {
          id: 1,
          question: "¿Cuál es la derivada de f(x) = x²?",
          formula: "$$f(x) = x^2$$",
          options: [
            { id: "A", formula: "$$f'(x) = 2x$$" },
            { id: "B", formula: "$$f'(x) = x^2$$" },
            { id: "C", formula: "$$f'(x) = 2$$" },
            { id: "D", formula: "$$f'(x) = x$$" }
          ],
          correctOptionId: "A",
          explanation: "La derivada de x² es 2x porque aplicamos la regla de la potencia: d/dx(x^n) = n·x^(n-1)."
        },
        {
          id: 2,
          question: "¿Cuál es la derivada de f(x) = 5x + 3?",
          formula: "$$f(x) = 5x + 3$$",
          options: [
            { id: "A", formula: "$$f'(x) = 5x$$" },
            { id: "B", formula: "$$f'(x) = 5$$" },
            { id: "C", formula: "$$f'(x) = 3$$" },
            { id: "D", formula: "$$f'(x) = 8$$" }
          ],
          correctOptionId: "B",
          explanation: "La derivada de 5x + 3 es 5, porque d/dx(5x) = 5 y d/dx(3) = 0."
        },
        {
          id: 3,
          question: "¿Cuál es la derivada de f(x) = sin(x)?",
          formula: "$$f(x) = \\sin(x)$$",
          options: [
            { id: "A", formula: "$$f'(x) = \\cos(x)$$" },
            { id: "B", formula: "$$f'(x) = -\\sin(x)$$" },
            { id: "C", formula: "$$f'(x) = -\\cos(x)$$" },
            { id: "D", formula: "$$f'(x) = \\tan(x)$$" }
          ],
          correctOptionId: "A",
          explanation: "La derivada del seno es el coseno: d/dx(sin(x)) = cos(x)."
        },
        {
          id: 4,
          question: "¿Cuál es la derivada de f(x) = cos(x)?",
          formula: "$$f(x) = \\cos(x)$$",
          options: [
            { id: "A", formula: "$$f'(x) = \\sin(x)$$" },
            { id: "B", formula: "$$f'(x) = -\\sin(x)$$" },
            { id: "C", formula: "$$f'(x) = -\\cos(x)$$" },
            { id: "D", formula: "$$f'(x) = \\tan(x)$$" }
          ],
          correctOptionId: "B",
          explanation: "La derivada del coseno es el negativo del seno: d/dx(cos(x)) = -sin(x)."
        },
        {
          id: 5,
          question: "¿Cuál es la derivada de f(x) = x³?",
          formula: "$$f(x) = x^3$$",
          options: [
            { id: "A", formula: "$$f'(x) = 3x^2$$" },
            { id: "B", formula: "$$f'(x) = 3x$$" },
            { id: "C", formula: "$$f'(x) = x^3$$" },
            { id: "D", formula: "$$f'(x) = 3$$" }
          ],
          correctOptionId: "A",
          explanation: "La derivada de x³ es 3x², aplicando la regla de la potencia: d/dx(x^n) = n·x^(n-1)."
        },
        {
          id: 6,
          question: "¿Cuál es la derivada de f(x) = 7?",
          formula: "$$f(x) = 7$$",
          options: [
            { id: "A", formula: "$$f'(x) = 7x$$" },
            { id: "B", formula: "$$f'(x) = 7$$" },
            { id: "C", formula: "$$f'(x) = 1$$" },
            { id: "D", formula: "$$f'(x) = 0$$" }
          ],
          correctOptionId: "D",
          explanation: "La derivada de una constante es cero: d/dx(c) = 0."
        },
        {
          id: 7,
          question: "¿Cuál es la derivada de f(x) = e^x?",
          formula: "$$f(x) = e^x$$",
          options: [
            { id: "A", formula: "$$f'(x) = e^x$$" },
            { id: "B", formula: "$$f'(x) = xe^x$$" },
            { id: "C", formula: "$$f'(x) = e^{x-1}$$" },
            { id: "D", formula: "$$f'(x) = 1$$" }
          ],
          correctOptionId: "A",
          explanation: "La derivada de e^x es e^x, la función exponencial es igual a su derivada."
        },
        {
          id: 8,
          question: "¿Cuál es la derivada de f(x) = ln(x)?",
          formula: "$$f(x) = \\ln(x)$$",
          options: [
            { id: "A", formula: "$$f'(x) = \\ln(x)$$" },
            { id: "B", formula: "$$f'(x) = \\frac{1}{x}$$" },
            { id: "C", formula: "$$f'(x) = x$$" },
            { id: "D", formula: "$$f'(x) = 1$$" }
          ],
          correctOptionId: "B",
          explanation: "La derivada del logaritmo natural es 1/x: d/dx(ln(x)) = 1/x."
        },
        {
          id: 9,
          question: "¿Cuál es la derivada de f(x) = x² + 3x?",
          formula: "$$f(x) = x^2 + 3x$$",
          options: [
            { id: "A", formula: "$$f'(x) = 2x + 3$$" },
            { id: "B", formula: "$$f'(x) = 2x$$" },
            { id: "C", formula: "$$f'(x) = x^2 + 3$$" },
            { id: "D", formula: "$$f'(x) = 5x$$" }
          ],
          correctOptionId: "A",
          explanation: "Aplicamos la regla de la suma: d/dx(x² + 3x) = d/dx(x²) + d/dx(3x) = 2x + 3."
        },
        {
          id: 10,
          question: "¿Cuál es la derivada de f(x) = √x?",
          formula: "$$f(x) = \\sqrt{x} = x^{1/2}$$",
          options: [
            { id: "A", formula: "$$f'(x) = \\frac{1}{2\\sqrt{x}}$$" },
            { id: "B", formula: "$$f'(x) = \\frac{1}{\\sqrt{x}}$$" },
            { id: "C", formula: "$$f'(x) = 2\\sqrt{x}$$" },
            { id: "D", formula: "$$f'(x) = \\frac{1}{2x}$$" }
          ],
          correctOptionId: "A",
          explanation: "La derivada de √x = x^(1/2) es (1/2)x^(-1/2) = 1/(2√x), usando la regla de la potencia."
        }
      ];
    } else if (difficulty === 'medium') {
      currentQuestions = [
        {
          id: 1,
          question: "¿Cuál es la derivada de f(x) = sin(2x)?",
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
          id: 2,
          question: "¿Cuál es la derivada de f(x) = (x² + 1)³?",
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
          id: 3,
          question: "¿Cuál es la derivada de f(x) = e^(3x²)?",
          formula: "$$f(x) = e^{3x^2}$$",
          options: [
            { id: "A", formula: "$$f'(x) = e^{3x^2} \\cdot 3x^2$$" },
            { id: "B", formula: "$$f'(x) = e^{3x^2} \\cdot 6x$$" },
            { id: "C", formula: "$$f'(x) = 3e^{3x^2} \\cdot 2x$$" },
            { id: "D", formula: "$$f'(x) = 6xe^{3x^2}$$" }
          ],
          correctOptionId: "B",
          explanation: "Aplicamos la regla de la cadena: d/dx(e^(3x²)) = e^(3x²) · d/dx(3x²) = e^(3x²) · 6x = 6xe^(3x²)."
        },
        {
          id: 4,
          question: "¿Cuál es la derivada de f(x) = ln(cos(x))?",
          formula: "$$f(x) = \\ln(\\cos(x))$$",
          options: [
            { id: "A", formula: "$$f'(x) = -\\tan(x)$$" },
            { id: "B", formula: "$$f'(x) = \\frac{-\\sin(x)}{\\cos(x)}$$" },
            { id: "C", formula: "$$f'(x) = -\\sin(x)$$" },
            { id: "D", formula: "$$f'(x) = \\frac{1}{\\cos(x)}$$" }
          ],
          correctOptionId: "A",
          explanation: "Aplicamos la regla de la cadena: d/dx(ln(cos(x))) = (1/cos(x)) · d/dx(cos(x)) = (1/cos(x)) · (-sin(x)) = -sin(x)/cos(x) = -tan(x)."
        },
        {
          id: 5,
          question: "¿Cuál es la derivada de f(x) = x·sin(x)?",
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
          id: 6,
          question: "¿Cuál es la derivada de f(x) = e^x·cos(x)?",
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
          id: 7,
          question: "¿Cuál es la derivada de f(x) = tan(x)?",
          formula: "$$f(x) = \\tan(x)$$",
          options: [
            { id: "A", formula: "$$f'(x) = \\sec^2(x)$$" },
            { id: "B", formula: "$$f'(x) = 1 + \\tan^2(x)$$" },
            { id: "C", formula: "$$f'(x) = \\frac{1}{\\cos^2(x)}$$" },
            { id: "D", formula: "$$f'(x) = \\sec(x) \\cdot \\tan(x)$$" }
          ],
          correctOptionId: "A",
          explanation: "La derivada de la tangente es el cuadrado de la secante: d/dx(tan(x)) = sec²(x)."
        },
        {
          id: 8,
          question: "¿Cuál es la derivada de f(x) = (x+1)/(x-1)?",
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
          id: 9,
          question: "¿Cuál es la derivada de f(x) = e^(sin(x))?",
          formula: "$$f(x) = e^{\\sin(x)}$$",
          options: [
            { id: "A", formula: "$$f'(x) = e^{\\sin(x)} \\cdot \\cos(x)$$" },
            { id: "B", formula: "$$f'(x) = \\cos(x) \\cdot e^{\\sin(x)}$$" },
            { id: "C", formula: "$$f'(x) = e^{\\sin(x)} \\cdot \\sin(x)$$" },
            { id: "D", formula: "$$f'(x) = e^{\\cos(x)}$$" }
          ],
          correctOptionId: "A",
          explanation: "Aplicamos la regla de la cadena: d/dx(e^(sin(x))) = e^(sin(x)) · d/dx(sin(x)) = e^(sin(x)) · cos(x)."
        },
        {
          id: 10,
          question: "¿Cuál es la derivada de f(x) = x·ln(x)?",
          formula: "$$f(x) = x \\cdot \\ln(x)$$",
          options: [
            { id: "A", formula: "$$f'(x) = \\ln(x) + 1$$" },
            { id: "B", formula: "$$f'(x) = 1 + \\ln(x)$$" },
            { id: "C", formula: "$$f'(x) = x \\cdot \\frac{1}{x} + \\ln(x)$$" },
            { id: "D", formula: "$$f'(x) = \\frac{1}{x}$$" }
          ],
          correctOptionId: "B",
          explanation: "Aplicamos la regla del producto: d/dx(x·ln(x)) = d/dx(x) · ln(x) + x · d/dx(ln(x)) = 1 · ln(x) + x · (1/x) = ln(x) + 1."
        }
      ];
    } else if (difficulty === 'hard') {
      currentQuestions = [
        {
          id: 1,
          question: "¿Cuál es la derivada de f(x) = ln(x²+1)·cos(3x)?",
          formula: "$$f(x) = \\ln(x^2+1) \\cdot \\cos(3x)$$",
          options: [
            { id: "A", formula: "$$f'(x) = \\frac{2x}{x^2+1} \\cdot \\cos(3x) - 3\\ln(x^2+1) \\cdot \\sin(3x)$$" },
            { id: "B", formula: "$$f'(x) = \\frac{2x}{x^2+1} \\cdot \\cos(3x) - \\ln(x^2+1) \\cdot 3\\sin(3x)$$" },
            { id: "C", formula: "$$f'(x) = \\frac{2x\\cos(3x)}{x^2+1} - 3\\ln(x^2+1)\\sin(3x)$$" },
            { id: "D", formula: "$$f'(x) = 2x\\cos(3x) - 3\\ln(x^2+1)\\sin(3x)$$" }
          ],
          correctOptionId: "C",
          explanation: "Aplicamos la regla del producto y la regla de la cadena: d/dx(ln(x²+1)·cos(3x)) = d/dx(ln(x²+1)) · cos(3x) + ln(x²+1) · d/dx(cos(3x)). Para d/dx(ln(x²+1)) aplicamos la regla de la cadena: (1/(x²+1)) · d/dx(x²+1) = (1/(x²+1)) · 2x = 2x/(x²+1). Para d/dx(cos(3x)) también aplicamos la regla de la cadena: -sin(3x) · d/dx(3x) = -sin(3x) · 3 = -3sin(3x). Finalmente: f'(x) = (2x/(x²+1)) · cos(3x) + ln(x²+1) · (-3sin(3x)) = (2xcos(3x))/(x²+1) - 3ln(x²+1)sin(3x)."
        },
        {
          id: 2,
          question: "¿Cuál es la derivada de f(x) = (sin(x))^cos(x)?",
          formula: "$$f(x) = (\\sin(x))^{\\cos(x)}$$",
          options: [
            { id: "A", formula: "$$f'(x) = (\\sin(x))^{\\cos(x)} \\cdot [\\cos(x) \\cdot \\frac{\\cos(x)}{\\sin(x)} - \\sin(x) \\cdot \\ln(\\sin(x))]$$" },
            { id: "B", formula: "$$f'(x) = (\\sin(x))^{\\cos(x)} \\cdot [\\cos(x) \\cdot \\cot(x) - \\sin(x) \\cdot \\ln(\\sin(x))]$$" },
            { id: "C", formula: "$$f'(x) = (\\sin(x))^{\\cos(x)} \\cdot [\\cos(x) \\cdot \\cot(x) + \\ln(\\sin(x)) \\cdot (-\\sin(x))]$$" },
            { id: "D", formula: "$$f'(x) = (\\sin(x))^{\\cos(x)} \\cdot [\\frac{\\cos^2(x)}{\\sin(x)} - \\sin(x)\\ln(\\sin(x))]$$" }
          ],
          correctOptionId: "D",
          explanation: "Para derivar esta función compuesta, tomamos logaritmos: ln(f(x)) = cos(x) · ln(sin(x)). Derivamos ambos lados: f'(x)/f(x) = d/dx(cos(x) · ln(sin(x))). Aplicando la regla del producto: f'(x)/f(x) = d/dx(cos(x)) · ln(sin(x)) + cos(x) · d/dx(ln(sin(x))) = -sin(x) · ln(sin(x)) + cos(x) · (cos(x)/sin(x)) = -sin(x)ln(sin(x)) + cos²(x)/sin(x). Despejando: f'(x) = f(x) · [-sin(x)ln(sin(x)) + cos²(x)/sin(x)] = (sin(x))^cos(x) · [cos²(x)/sin(x) - sin(x)ln(sin(x))]."
        },
        {
          id: 3,
          question: "¿Cuál es la derivada de f(x) = arctan(e^x)?",
          formula: "$$f(x) = \\arctan(e^x)$$",
          options: [
            { id: "A", formula: "$$f'(x) = \\frac{e^x}{1 + e^{2x}}$$" },
            { id: "B", formula: "$$f'(x) = \\frac{e^{-x}}{1 + e^{-2x}}$$" },
            { id: "C", formula: "$$f'(x) = \\frac{1}{1 + e^{2x}}$$" },
            { id: "D", formula: "$$f'(x) = \\frac{e^x}{1 + (e^x)^2}$$" }
          ],
          correctOptionId: "A",
          explanation: "Aplicamos la regla de la cadena: d/dx(arctan(e^x)) = (1/(1+(e^x)²)) · d/dx(e^x) = (1/(1+e^(2x))) · e^x = e^x/(1+e^(2x))."
        },
        {
          id: 4,
          question: "¿Cuál es la derivada de f(x) = sec(x²)?",
          formula: "$$f(x) = \\sec(x^2)$$",
          options: [
            { id: "A", formula: "$$f'(x) = 2x \\cdot \\sec(x^2) \\cdot \\tan(x^2)$$" },
            { id: "B", formula: "$$f'(x) = \\sec(x^2) \\cdot \\tan(x^2) \\cdot 2x$$" },
            { id: "C", formula: "$$f'(x) = 2x \\cdot \\tan(x^2) \\cdot \\sec(x^2)$$" },
            { id: "D", formula: "$$f'(x) = 2 \\cdot \\sec(x^2) \\cdot \\tan(x^2)$$" }
          ],
          correctOptionId: "A",
          explanation: "Aplicamos la regla de la cadena: d/dx(sec(x²)) = sec(x²)tan(x²) · d/dx(x²) = sec(x²)tan(x²) · 2x = 2x · sec(x²) · tan(x²)."
        },
        {
          id: 5,
          question: "¿Cuál es la derivada de f(x) = x·sin(x²)?",
          formula: "$$f(x) = x \\cdot \\sin(x^2)$$",
          options: [
            { id: "A", formula: "$$f'(x) = \\sin(x^2) + 2x^2\\cos(x^2)$$" },
            { id: "B", formula: "$$f'(x) = \\sin(x^2) + x \\cdot 2x \\cdot \\cos(x^2)$$" },
            { id: "C", formula: "$$f'(x) = \\sin(x^2) + 2x^2 \\cdot \\cos(x^2)$$" },
            { id: "D", formula: "$$f'(x) = \\sin(x^2) + 2x \\cdot \\cos(x^2)$$" }
          ],
          correctOptionId: "B",
          explanation: "Aplicamos la regla del producto y la regla de la cadena: d/dx(x·sin(x²)) = d/dx(x) · sin(x²) + x · d/dx(sin(x²)) = 1 · sin(x²) + x · cos(x²) · d/dx(x²) = sin(x²) + x · cos(x²) · 2x = sin(x²) + 2x² · cos(x²)."
        },
        {
          id: 6,
          question: "¿Cuál es la derivada de f(x) = e^(x·sin(x))?",
          formula: "$$f(x) = e^{x \\cdot \\sin(x)}$$",
          options: [
            { id: "A", formula: "$$f'(x) = e^{x \\cdot \\sin(x)} \\cdot [\\sin(x) + x\\cos(x)]$$" },
            { id: "B", formula: "$$f'(x) = e^{x \\cdot \\sin(x)} \\cdot [x\\cos(x) + \\sin(x)]$$" },
            { id: "C", formula: "$$f'(x) = e^{x \\cdot \\sin(x)} \\cdot [\\sin(x) + x\\cos(x) + \\sin(x)]$$" },
            { id: "D", formula: "$$f'(x) = e^{x \\cdot \\sin(x)} \\cdot x\\cos(x)$$" }
          ],
          correctOptionId: "A",
          explanation: "Aplicamos la regla de la cadena: d/dx(e^(x·sin(x))) = e^(x·sin(x)) · d/dx(x·sin(x)). Para d/dx(x·sin(x)) aplicamos la regla del producto: d/dx(x) · sin(x) + x · d/dx(sin(x)) = 1 · sin(x) + x · cos(x) = sin(x) + x·cos(x). Finalmente: f'(x) = e^(x·sin(x)) · [sin(x) + x·cos(x)]."
        },
        {
          id: 7,
          question: "¿Cuál es la derivada de f(x) = ln(sin(x) + cos(x))?",
          formula: "$$f(x) = \\ln(\\sin(x) + \\cos(x))$$",
          options: [
            { id: "A", formula: "$$f'(x) = \\frac{\\cos(x) - \\sin(x)}{\\sin(x) + \\cos(x)}$$" },
            { id: "B", formula: "$$f'(x) = \\frac{-\\sin(x) + \\cos(x)}{\\sin(x) + \\cos(x)}$$" },
            { id: "C", formula: "$$f'(x) = \\frac{\\cos(x) - \\sin(x)}{1 + \\sin(x) \\cdot \\cos(x)}$$" },
            { id: "D", formula: "$$f'(x) = \\frac{1}{\\sin(x) + \\cos(x)}$$" }
          ],
          correctOptionId: "A",
          explanation: "Aplicamos la regla de la cadena: d/dx(ln(sin(x) + cos(x))) = (1/(sin(x) + cos(x))) · d/dx(sin(x) + cos(x)) = (1/(sin(x) + cos(x))) · (cos(x) - sin(x)) = (cos(x) - sin(x))/(sin(x) + cos(x))."
        },
        {
          id: 8,
          question: "¿Cuál es la derivada de f(x) = arcsin(x²)?",
          formula: "$$f(x) = \\arcsin(x^2)$$",
          options: [
            { id: "A", formula: "$$f'(x) = \\frac{2x}{\\sqrt{1 - x^4}}$$" },
            { id: "B", formula: "$$f'(x) = \\frac{2x}{\\sqrt{1 - (x^2)^2}}$$" },
            { id: "C", formula: "$$f'(x) = \\frac{2x}{\\sqrt{1 - 4x^2}}$$" },
            { id: "D", formula: "$$f'(x) = \\frac{1}{\\sqrt{1 - x^4}}$$" }
          ],
          correctOptionId: "B",
          explanation: "Aplicamos la regla de la cadena: d/dx(arcsin(x²)) = (1/√(1-(x²)²)) · d/dx(x²) = (1/√(1-(x²)²)) · 2x = 2x/√(1-(x²)²)."
        },
        {
          id: 9,
          question: "¿Cuál es la derivada de f(x) = x^(sin(x))?",
          formula: "$$f(x) = x^{\\sin(x)}$$",
          options: [
            { id: "A", formula: "$$f'(x) = x^{\\sin(x)} \\cdot [\\sin(x) \\cdot \\frac{1}{x} + \\ln(x) \\cdot \\cos(x)]$$" },
            { id: "B", formula: "$$f'(x) = x^{\\sin(x) - 1} \\cdot [\\sin(x) + x\\ln(x)\\cos(x)]$$" },
            { id: "C", formula: "$$f'(x) = x^{\\sin(x)} \\cdot [\\frac{\\sin(x)}{x} + \\cos(x)\\ln(x)]$$" },
            { id: "D", formula: "$$f'(x) = x^{\\sin(x)} \\cdot \\ln(x) \\cdot \\cos(x)$$" }
          ],
          correctOptionId: "C",
          explanation: "Para derivar esta función compuesta, tomamos logaritmos: ln(f(x)) = sin(x) · ln(x). Derivamos ambos lados: f'(x)/f(x) = d/dx(sin(x) · ln(x)). Aplicando la regla del producto: f'(x)/f(x) = d/dx(sin(x)) · ln(x) + sin(x) · d/dx(ln(x)) = cos(x) · ln(x) + sin(x) · (1/x) = cos(x)ln(x) + sin(x)/x. Despejando: f'(x) = f(x) · [cos(x)ln(x) + sin(x)/x] = x^(sin(x)) · [sin(x)/x + cos(x)ln(x)]."
        },
        {
          id: 10,
          question: "¿Cuál es la derivada de f(x) = (x² + 1)/(x² - 1)?",
          formula: "$$f(x) = \\frac{x^2 + 1}{x^2 - 1}$$",
          options: [
            { id: "A", formula: "$$f'(x) = \\frac{-4x}{(x^2 - 1)^2}$$" },
            { id: "B", formula: "$$f'(x) = \\frac{4x}{(x^2 - 1)^2}$$" },
            { id: "C", formula: "$$f'(x) = \\frac{-4x}{(x^2 - 1)}$$" },
            { id: "D", formula: "$$f'(x) = \\frac{2x(x^2 - 1) - 2x(x^2 + 1)}{(x^2 - 1)^2}$$" }
          ],
          correctOptionId: "A",
          explanation: "Aplicamos la regla del cociente: d/dx((x² + 1)/(x² - 1)) = ((x² - 1) · d/dx(x² + 1) - (x² + 1) · d/dx(x² - 1)) / (x² - 1)² = ((x² - 1) · 2x - (x² + 1) · 2x) / (x² - 1)² = (2x(x² - 1) - 2x(x² + 1)) / (x² - 1)² = (2x(x² - 1 - x² - 1)) / (x² - 1)² = (2x(-2)) / (x² - 1)² = -4x / (x² - 1)²."
        }
      ];
    }
    
    // Barajar las preguntas
    shuffleArray(currentQuestions);
    
    // Limitar a 10 preguntas
    currentQuestions = currentQuestions.slice(0, TOTAL_QUESTIONS);
  };
  
  // Función para barajar un array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };
  
  // Función para mostrar una pregunta
  const showQuestion = (index) => {
    if (index >= currentQuestions.length) {
      // Se han respondido todas las preguntas, mostrar resumen
      showSummary();
      return;
    }
    
    // Actualizar el índice de pregunta actual
    currentQuestionIndex = index;
    
    // Obtener la pregunta actual
    const question = currentQuestions[index];
    
    // Actualizar contador de preguntas
    currentQuestionEl.textContent = index + 1;
    
    // Mostrar texto de la pregunta
    questionText.textContent = question.question;
    
    // Mostrar fórmula de la pregunta
    questionFormula.innerHTML = `<p class="math">${question.formula}</p>`;
    
    // Mostrar opciones
    question.options.forEach((option, i) => {
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
      renderMathInElement(questionFormula, {
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
  };
  
  // Función para iniciar el temporizador
  const startTimer = () => {
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
  };
  
  // Función para reiniciar el temporizador
  const resetTimer = () => {
    clearInterval(timer);
    timeRemaining = TIMER_DURATION;
    timeLeftEl.textContent = timeRemaining;
    timeLeftEl.style.color = ''; // Color por defecto
    startTimer();
  };
  
  // Función para verificar la respuesta
  const verifyAnswer = (timedOut = false) => {
    // Pausar el temporizador
    clearInterval(timer);
    
    // Obtener la pregunta actual
    const question = currentQuestions[currentQuestionIndex];
    
    // Verificar si la respuesta es correcta
    const isCorrect = !timedOut && selectedOption === question.correctOptionId;
    
    // Actualizar estadísticas
    if (isCorrect) {
      quizStats.correct++;
      quizStats.points += pointsPerQuestion;
      
      // Si el usuario está autenticado, actualizar sus puntos
      const user = storage.getUser();
      if (user) {
        const newPoints = user.points + pointsPerQuestion;
        storage.updateUserPoints(user.username, newPoints);
      }
    } else {
      quizStats.incorrect++;
    }
    
    // Mostrar resultado
    showResult(isCorrect, question);
  };
  
  // Función para mostrar el resultado
  const showResult = (isCorrect, question) => {
    // Ocultar el quiz y mostrar el resultado
    quizContainer.classList.add('hidden');
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
    explanationText.textContent = question.explanation;
    
    // Mostrar puntos ganados
    pointsValue.textContent = isCorrect ? `+${pointsPerQuestion}` : '0';
    
    // Cambiar texto del botón según si es la última pregunta o no
    if (currentQuestionIndex >= currentQuestions.length - 1) {
      nextBtn.textContent = 'Ver Resumen';
    } else {
      nextBtn.textContent = 'Siguiente Pregunta';
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
  };
  
  // Función para mostrar el resumen
  const showSummary = () => {
    // Ocultar el resultado y mostrar el resumen
    resultContainer.classList.add('hidden');
    summaryContainer.classList.remove('hidden');
    
    // Actualizar estadísticas
    correctCount.textContent = quizStats.correct;
    incorrectCount.textContent = quizStats.incorrect;
    totalPoints.textContent = quizStats.points;
  };
  
  // Event listeners
  
  // Selector de dificultad
  easyBtn.addEventListener('click', () => startQuiz('easy'));
  mediumBtn.addEventListener('click', () => startQuiz('medium'));
  hardBtn.addEventListener('click', () => startQuiz('hard'));
  
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
  
  // Botón de siguiente pregunta
  nextBtn.addEventListener('click', () => {
    if (currentQuestionIndex >= currentQuestions.length - 1) {
      // Mostrar resumen si es la última pregunta
      showSummary();
    } else {
      // Mostrar siguiente pregunta
      showQuestion(currentQuestionIndex + 1);
      // Ocultar resultado y mostrar el quiz
      resultContainer.classList.add('hidden');
      quizContainer.classList.remove('hidden');
    }
  });
  
  // Botón de intentar otro quiz
  retryBtn.addEventListener('click', () => {
    // Reiniciar estadísticas
    quizStats = {
      correct: 0,
      incorrect: 0,
      points: 0
    };
    
    // Ocultar resumen y mostrar selector de dificultad
    summaryContainer.classList.add('hidden');
    difficultySelector.classList.remove('hidden');
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