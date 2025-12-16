/**
 * ============================================
 * CHATBOT DE MATEMÁTICAS - VERSIÓN TRANSPARENTE V2
 * ============================================
 */

const CONFIG = {
  courseId: 6,
  courseName: 'Fracciones Matemáticas',
  webhookUrl: 'https://n8n.srv1000857.hstgr.cloud/webhook/76fb1c45-b2f9-4f6c-bcc2-79a742581288/chat',
  avatarUrl: 'https://uxdigital.cl/wp-content/uploads/2025/01/tutor-biologia-pro.gif', // ✅ GIF Transparente
  colors: {
    primary: '#0047AB',
    secondary: '#1E90FF'
  },
  emoji: '🧮',
  messages: {
    greeting: '¡Hola {nombre}! 👋 Soy tu tutor de matemáticas. ¿En qué puedo ayudarte hoy?',
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
  
  if (!isInCourse(CONFIG.courseId)) return;
  
  setTimeout(() => {
    const userInfo = getUserInfo();
    const container = document.createElement('div');
    container.id = 'n8n-chat';
    document.body.appendChild(container);
    
    // Cargar estilos base
    if (!document.querySelector('link[href*="n8n/chat"]')) {
      const link = document.createElement('link');
      link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    
    // Inyectar CSS personalizado con ALTA PRIORIDAD
    const style = document.createElement('style');
    style.innerHTML = `
      /* Header y Mensajes */
      #n8n-chat .chat-header {
        background: linear-gradient(135deg, ${CONFIG.colors.primary} 0%, ${CONFIG.colors.secondary} 100%) !important;
      }
      #n8n-chat .chat-message-user {
        background: linear-gradient(135deg, ${CONFIG.colors.primary} 0%, ${CONFIG.colors.secondary} 100%) !important;
        color: #fff !important;
      }
      #n8n-chat .chat-input-send-button {
        background: ${CONFIG.colors.primary} !important;
      }
      
      /* --- SOLUCIÓN FONDO FUCSIA --- */
      /* 1. Forzamos variables CSS a transparente */
      :root {
        --chat--toggle--background: transparent !important;
        --chat--toggle--hover--background: transparent !important;
      }

      /* 2. Atacamos el botón específicamente */
      #n8n-chat .chat-window-toggle {
        background-color: transparent !important;
        background-image: url('${CONFIG.avatarUrl}') !important;
        background-repeat: no-repeat !important;
        background-position: center bottom !important; 
        background-size: 140% !important; /* Hacemos el GIF un poco más grande */
        
        box-shadow: none !important; /* Elimina el brillo rosa */
        border: none !important;
        width: 140px !important;
        height: 140px !important;
      }

      /* 3. Ocultamos el icono SVG original */
      #n8n-chat .chat-window-toggle svg {
        display: none !important;
        opacity: 0 !important;
      }

      /* Animación suave al pasar el mouse */
      #n8n-chat .chat-window-toggle:hover {
        transform: scale(1.05);
        transition: transform 0.3s ease;
      }
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
      });
  }, 1000); // Aumenté el tiempo de espera levemente para asegurar carga
})();
