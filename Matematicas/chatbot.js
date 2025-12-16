/**
 * ============================================
 * CHATBOT DE MATEMÁTICAS - VERSIÓN "NUCLEAR" (TRANSPARENCIA FORZADA)
 * ============================================
 */

const CONFIG = {
  courseId: 6,
  courseName: 'Fracciones Matemáticas',
  webhookUrl: 'https://n8n.srv1000857.hstgr.cloud/webhook/76fb1c45-b2f9-4f6c-bcc2-79a742581288/chat',
  avatarUrl:, null, // 'https://uxdigital.cl/wp-content/uploads/2025/01/tutor-biologia-pro.gif',
  colors: {
    primary: '#0047AB',
    secondary: '#1E90FF'
  },
  emoji: '🧮',
  messages: {
    greeting: '¡Hola {nombre}! 👋 Soy tu tutor de matemáticas 1. ¿En qué puedo ayudarte hoy?',
    greetingAnonymous: '¿Cómo puedo ayudarte hoy?',
    subtitle: 'Soy tu Tutor virtual de Matemáticas',
    placeholder: '¿Cuál es tu consulta?'
  }
};

(function() {
  'use strict';
  
  function isInCourse(courseId) {
    const urlParams = new URLSearchParams(window.location.search);
    const currentCourseId = parseInt(urlParams.get('id')) || 0;
    const moodleCourseId = (typeof M !== 'undefined' && M.cfg && M.cfg.courseId) ? parseInt(M.cfg.courseId) : 0;
    const bodyClasses = document.body.className;
    const courseMatch = bodyClasses.match(/course-(\d+)/);
    const bodyCourseId = courseMatch ? parseInt(courseMatch[1]) : 0;
    return currentCourseId === courseId || moodleCourseId === courseId || bodyCourseId === courseId;
  }
  
  function getUserInfo() {
    let userName = '';
    const userMenuToggle = document.querySelector('#user-menu-toggle');
    if (userMenuToggle) {
      const clone = userMenuToggle.cloneNode(true);
      Array.from(clone.children).forEach(child => child.remove());
      let rawName = clone.textContent.trim().replace(/\s+/g, ' ');
      userName = rawName.split(' - ')[0].trim();
    }
    return {
      name: userName || 'Estudiante',
      firstName: userName ? userName.split(' ')[0] : 'Estudiante'
    };
  }

  // FUNCIÓN PARA FORZAR ESTILOS MANUALMENTE
  function forceTransparency() {
    const toggles = document.querySelectorAll('.chat-window-toggle');
    toggles.forEach(btn => {
      // Forzar estilos en línea (tienen prioridad sobre CSS)
      btn.style.setProperty('background', 'transparent', 'important');
      btn.style.setProperty('background-color', 'transparent', 'important');
      btn.style.setProperty('box-shadow', 'none', 'important');
      btn.style.setProperty('border', 'none', 'important');
      btn.style.setProperty('width', '150px', 'important'); // Más grande para que quepa el GIF
      btn.style.setProperty('height', '150px', 'important');
      
      // Asegurar que la imagen se vea completa
      btn.style.setProperty('background-image', `url('${CONFIG.avatarUrl}')`, 'important');
      btn.style.setProperty('background-size', 'contain', 'important');
      btn.style.setProperty('background-repeat', 'no-repeat', 'important');
      btn.style.setProperty('background-position', 'center bottom', 'important');

      // Ocultar el SVG (el icono de chat por defecto)
      const svg = btn.querySelector('svg');
      if(svg) svg.style.display = 'none';
    });
  }
  
  if (!isInCourse(CONFIG.courseId)) return;
  
  setTimeout(() => {
    const userInfo = getUserInfo();
    const container = document.createElement('div');
    container.id = 'n8n-chat';
    document.body.appendChild(container);
    
    // CSS DE ALTA PRIORIDAD
    const style = document.createElement('style');
    style.innerHTML = `
      /* Colores del chat interno */
      #n8n-chat .chat-header { background: linear-gradient(135deg, ${CONFIG.colors.primary} 0%, ${CONFIG.colors.secondary} 100%) !important; }
      #n8n-chat .chat-message-user { background: linear-gradient(135deg, ${CONFIG.colors.primary} 0%, ${CONFIG.colors.secondary} 100%) !important; color: #fff !important; }
      #n8n-chat .chat-input-send-button { background: ${CONFIG.colors.primary} !important; }

      /* MATAR EL FONDO FUCSIA */
      body #n8n-chat .chat-window-toggle {
        background: transparent !important;
        background-color: transparent !important;
        box-shadow: none !important;
        border: none !important;
        width: 150px !important;
        height: 150px !important;
        border-radius: 0 !important; /* Importante: quita el recorte circular */
      }
      body #n8n-chat .chat-window-toggle svg { display: none !important; }
      body #n8n-chat .chat-window-toggle:hover { transform: scale(1.05); }
    `;
    document.head.appendChild(style);
    
    import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js')
      .then(({ createChat }) => {
        const greeting = userInfo.firstName !== 'Estudiante' 
          ? CONFIG.messages.greeting.replace('{nombre}', userInfo.firstName)
          : CONFIG.messages.greetingAnonymous;
          
        createChat({
          webhookUrl: CONFIG.webhookUrl,
          target: '#n8n-chat',
          mode: 'window',
          chatInputKey: 'chatInput',
          chatSessionKey: 'sessionId',
          loadPreviousSession: true,
          showWelcomeScreen: false,
          defaultLanguage: 'es',
          initialMessages: [greeting],
          i18n: {
            es: {
              title: `¡Hola ${userInfo.firstName}! ${CONFIG.emoji}`,
              subtitle: CONFIG.messages.subtitle,
              getStarted: 'Empezar',
              inputPlaceholder: CONFIG.messages.placeholder,
            },
          },
        });

        // VIGILANTE CONSTANTE: Ejecuta la limpieza de estilos cada 500ms durante 5 segundos
        // Esto corrige el problema si el chat tarda en cargar
        let attempts = 0;
        const interval = setInterval(() => {
          forceTransparency();
          attempts++;
          if (attempts > 20) clearInterval(interval); // Parar después de 10 segundos
        }, 500);
      });
  }, 1000);
})();
