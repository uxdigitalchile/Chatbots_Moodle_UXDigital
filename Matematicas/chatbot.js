/**
 * ============================================
 * CHATBOT DE MATEMÁTICAS - CONFIGURACIÓN
 * ============================================
 */

const CONFIG = {
  courseId: 6,
  courseName: 'Fracciones Matemáticas',
  webhookUrl: 'https://n8n.srv1000857.hstgr.cloud/webhook/76fb1c45-b2f9-4f6c-bcc2-79a742581288/chat',
  
  // CAMBIAR AQUÍ EL GIF:
  avatarUrl: null, // 'https://uxdigital.cl/wp-content/uploads/2025/01/bot-uxdigital.gif',
  
  colors: {
    primary: '#0047AB',      // Azul Rey
    secondary: '#1E90FF'     // Azul Dodger
  },
  
  emoji: '🧮',
  
  messages: {
    greeting: '¡Hola {nombre}! 👋 Soy tu tutor de matemáticas. ¿En qué puedo ayudarte hoy?',
    greetingAnonymous: '¿Cómo puedo ayudarte hoy?',
    subtitle: 'Soy tu Tutor virtual de Matemáticas',
    placeholder: '¿Cuál es tu consulta?'
  }
};

/**
 * ============================================
 * CÓDIGO DEL CHATBOT (NO MODIFICAR)
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
      }
      #n8n-chat .chat-message-user {
        background: linear-gradient(135deg, ${CONFIG.colors.primary} 0%, ${CONFIG.colors.secondary} 100%) !important;
        color: #ffffff !important;
      }
      #n8n-chat .chat-input:focus {
        border-color: ${CONFIG.colors.primary} !important;
      }
      #n8n-chat .chat-input-send-button {
        background: linear-gradient(135deg, ${CONFIG.colors.primary} 0%, ${CONFIG.colors.secondary} 100%) !important;
      }
    `;
    
    if (CONFIG.avatarUrl) {
      cssRules += `
      #n8n-chat .chat-window-toggle {
        background-image: url('${CONFIG.avatarUrl}') !important;
        background-size: cover !important;
        background-position: center !important;
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
