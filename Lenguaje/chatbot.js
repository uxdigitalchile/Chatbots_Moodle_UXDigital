/**
 * ============================================
 * CHATBOT LENGUAJE - SIN GLOBO V3
 * ============================================
 */

const CONFIG = {
  courseId: 4,
  courseName: 'Lenguaje y Comunicación',
  webhookUrl: 'https://n8n.srv1000857.hstgr.cloud/webhook/5979f63d-4dac-46cd-9aa8-e74d7a927b27/chat',
  avatarUrl: 'https://uxdigital.cl/wp-content/uploads/2025/01/tutor-biologia-pro.gif',
  
  colors: {
    primary: '#FF8C00',      // Naranja oscuro
    secondary: '#FFA500'     // Naranja
  },
  
  emoji: '📖',
  
  messages: {
    greeting: '¡Hola {nombre}! 📚 Soy tu tutor de Lenguaje 1. ¿Listo para aprender?',
    greetingAnonymous: '¿Cómo puedo ayudarte hoy?',
    subtitle: 'Soy tu Tutor de Lenguaje y Comunicación',
    placeholder: '¿En qué puedo ayudarte?'
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
    
    if (!document.querySelector('link[href*="n8n/chat"]')) {
      const link = document.createElement('link');
      link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    
    const style = document.createElement('style');
    style.innerHTML = `
      #n8n-chat .chat-header {
        background: linear-gradient(135deg, ${CONFIG.colors.primary} 0%, ${CONFIG.colors.secondary} 100%) !important;
      }
      #n8n-chat .chat-message-user {
        background: linear-gradient(135deg, ${CONFIG.colors.primary} 0%, ${CONFIG.colors.secondary} 100%) !important;
        color: #ffffff !important;
      }
      #n8n-chat .chat-input-send-button {
        background: ${CONFIG.colors.primary} !important;
      }
      #n8n-chat .chat-message-bot {
        background: #fff8f0 !important;
      }
      
      /* AVATAR TRANSPARENTE */
      #n8n-chat .chat-window-toggle {
        background: transparent url('${CONFIG.avatarUrl}') no-repeat center bottom !important;
        background-size: 130% !important;
        box-shadow: none !important;
        border: none !important;
        width: 140px !important;
        height: 140px !important;
      }
      
      /* --- ANTI-GLOBO: ELIMINACIÓN DEL ICONO --- */
      #n8n-chat .chat-window-toggle svg {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        width: 0 !important;
        height: 0 !important;
      }
      
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
  }, 1000);
})();
