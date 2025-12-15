/**
 * ============================================
 * CHATBOT DE LENGUAJE - CONFIGURACIÓN CORREGIDA
 * ============================================
 */

const CONFIG = {
  courseId: 4,
  courseName: 'Lenguaje y Comunicación',
  webhookUrl: 'https://n8n.srv1000857.hstgr.cloud/webhook/5979f63d-4dac-46cd-9aa8-e74d7a927b27/chat',
  
  // ✅ ACTUALIZADO: URL del nuevo GIF transparente
  avatarUrl: 'https://uxdigital.cl/wp-content/uploads/2025/01/tutor-biologia-pro.gif',
  
  colors: {
    primary: '#FF8C00',      // Naranja oscuro
    secondary: '#FFA500'     // Naranja
  },
  
  emoji: '📖',
  
  messages: {
    greeting: '¡Hola {nombre}! 📚 Soy tu tutor de Lenguaje. ¿Estás listo para leer algo interesante hoy o prefieres que repasemos ortografía?',
    greetingAnonymous: '¿Cómo puedo ayudarte hoy?',
    subtitle: 'Soy tu Tutor de Lenguaje y Comunicación',
    placeholder: '¿En qué puedo ayudarte?'
  }
};

/**
 * ============================================
 * CÓDIGO DEL CHATBOT
 * ============================================
 */

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
    let cssRules = `
      #n8n-chat .chat-header {
        background: linear-gradient(135deg, ${CONFIG.colors.primary} 0%, ${CONFIG.colors.secondary} 100%) !important;
        padding: 20px !important;
        border-radius: 20px 20px 0 0 !important;
      }
      #n8n-chat .chat-message-user {
        background: linear-gradient(135deg, ${CONFIG.colors.primary} 0%, ${CONFIG.colors.secondary} 100%) !important;
        color: #ffffff !important;
        border-radius: 18px 18px 4px 18px !important;
        padding: 12px 16px !important;
      }
      #n8n-chat .chat-message-bot {
        background: #fff8f0 !important;
        border-radius: 18px 18px 18px 4px !important;
        padding: 12px 16px !important;
      }
      #n8n-chat .chat-input:focus {
        border-color: ${CONFIG.colors.primary} !important;
        box-shadow: 0 4px 16px rgba(255, 140, 0, 0.3) !important;
      }
      #n8n-chat .chat-input-send-button {
        background: linear-gradient(135deg, ${CONFIG.colors.primary} 0%, ${CONFIG.colors.secondary} 100%) !important;
      }
    `;
    
    // ✅ CORRECCIÓN DE CSS PARA FONDO TRANSPARENTE
    if (CONFIG.avatarUrl) {
      cssRules += `
      #n8n-chat .chat-window-toggle {
        background: url('${CONFIG.avatarUrl}') no-repeat center center !important;
        background-size: contain !important;
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
        width: 130px !important;
        height: 130px !important;
        padding: 0 !important;
      }
      #n8n-chat .chat-window-toggle svg {
        display: none !important;
      }
      #n8n-chat .chat-window-toggle:hover {
        transform: scale(1.05);
        transition: transform 0.2s ease;
      }
      `;
    }
    
    style.textContent = cssRules;
    document.head.appendChild(style);
    
    import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js')
      .then(({ createChat }) => {
        const greeting = userInfo.firstName !== 'Estudiante' 
          ? CONFIG.messages.greeting.replace('{nombre}', userInfo.firstName)
          : CONFIG.messages.greetingAnonymous;
        
        const title = userInfo.firstName !== 'Estudiante'
          ? `¡Hola ${userInfo.firstName}! ${CONFIG.emoji}`
          : `¡Hola! ${CONFIG.emoji}`;
        
        createChat({
          webhookUrl: CONFIG.webhookUrl,
          target: '#n8n-chat',
          mode: 'window',
          chatInputKey: 'chatInput',
          chatSessionKey: 'sessionId',
          loadPreviousSession: true,
          metadata: {},
          showWelcomeScreen: false,
          defaultLanguage: 'es',
          initialMessages: [greeting],
          i18n: {
            es: {
              title: title,
              subtitle: CONFIG.messages.subtitle,
              footer: '',
              getStarted: 'Nueva conversación',
              inputPlaceholder: CONFIG.messages.placeholder,
            },
          },
          enableStreaming: false,
        });
        
        console.log(`✅ Chatbot cargado: ${CONFIG.courseName}`);
      });
  }, 800);
})();
