/**
 * Chatbot de Lenguaje - Curso ID 4
 * UXDigital Chile
 * Versión FINAL - Avatar transparente como producción
 */

(function() {
  'use strict';
  
  const COURSE_ID = 4;
  const WEBHOOK_URL = 'https://n8n.srv1000857.hstgr.cloud/webhook/5979f63d-4dac-46cd-9aa8-e74d7a927b27/chat';
  
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
  
  if (!isInCourse(COURSE_ID)) return;
  
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
    
    // Solo estilos para header y mensajes, NO para el botón
    const style = document.createElement('style');
    style.textContent = `
      #n8n-chat .chat-header {
        background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%) !important;
      }
      #n8n-chat .chat-message-user {
        background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%) !important;
        color: #ffffff !important;
      }
      #n8n-chat .chat-message-bot {
        background: #fff8f0 !important;
      }
      #n8n-chat .chat-input:focus {
        border-color: #FF8C00 !important;
      }
      #n8n-chat .chat-input-send-button {
        background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%) !important;
      }
    `;
    document.head.appendChild(style);
    
    import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js')
      .then(({ createChat }) => {
        createChat({
          webhookUrl: WEBHOOK_URL,
          target: '#n8n-chat',
          mode: 'window',
          chatInputKey: 'chatInput',
          chatSessionKey: 'sessionId',
          loadPreviousSession: true,
          metadata: {},
          showWelcomeScreen: false,
          defaultLanguage: 'es',
          initialMessages: [
            userInfo.firstName !== 'Estudiante' 
              ? `¡Hola ${userInfo.firstName}! 📚 Soy tu tutor de Lenguaje. ¿Estás listo para leer algo interesante hoy o prefieres que repasemos ortografía?`
              : '¿Cómo puedo ayudarte hoy?'
          ],
          i18n: {
            es: {
              title: userInfo.firstName !== 'Estudiante' 
                ? `¡Hola ${userInfo.firstName}! 📖`
                : '¡Hola! 📖',
              subtitle: 'Soy tu Tutor de Lenguaje y Comunicación',
              footer: '',
              getStarted: 'Nueva conversación',
              inputPlaceholder: '¿En qué puedo ayudarte?',
            },
          },
          enableStreaming: false,
        });
      });
  }, 800);
})();
