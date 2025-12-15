/**
 * Chatbot de Lenguaje y Comunicación - Curso ID 4
 * UXDigital Chile
 * Última actualización: 2025-01-13 v1.2
 */

(function() {
  'use strict';
  
  const COURSE_ID = 4;
  const COURSE_NAME = 'Lenguaje y Comunicación';
  const WEBHOOK_URL = 'https://n8n.srv1000857.hstgr.cloud/webhook/5979f63d-4dac-46cd-9aa8-e74d7a927b27/chat';
  const COLORS = {
    primary: '#FF8C00',
    secondary: '#FFA500'
  };
  
  // Verificar si estamos en el curso correcto
  function isInCourse(courseId) {
    const urlParams = new URLSearchParams(window.location.search);
    const currentCourseId = parseInt(urlParams.get('id')) || 0;
    
    const moodleCourseId = (typeof M !== 'undefined' && M.cfg && M.cfg.courseId) 
      ? parseInt(M.cfg.courseId) 
      : 0;
    
    const bodyClasses = document.body.className;
    const courseMatch = bodyClasses.match(/course-(\d+)/);
    const bodyCourseId = courseMatch ? parseInt(courseMatch[1]) : 0;
    
    return currentCourseId === courseId || 
           moodleCourseId === courseId || 
           bodyCourseId === courseId;
  }
  
  // Detectar información del usuario
  function getUserInfo() {
    let userName = '';
    let userId = '';
    
    const userMenuToggle = document.querySelector('#user-menu-toggle');
    if (userMenuToggle) {
      const clone = userMenuToggle.cloneNode(true);
      Array.from(clone.children).forEach(child => child.remove());
      let rawName = clone.textContent.trim().replace(/\s+/g, ' ');
      userName = rawName.split(' - ')[0].trim();
    }
    
    if (typeof M !== 'undefined' && M.cfg && M.cfg.userId) {
      userId = M.cfg.userId.toString();
    } else {
      const userElement = document.querySelector('[data-userid]');
      if (userElement) userId = userElement.getAttribute('data-userid');
    }
    
    return {
      name: userName || 'Estudiante',
      firstName: userName ? userName.split(' ')[0] : 'Estudiante',
      userId: userId
    };
  }
  
  // Cargar chatbot
  function loadChatbot() {
    const userInfo = getUserInfo();
    
    // Crear contenedor
    const container = document.createElement('div');
    container.id = 'n8n-chat-lenguaje';
    document.body.appendChild(container);
    
    // Cargar CSS
    if (!document.querySelector('link[href*="n8n/chat"]')) {
      const link = document.createElement('link');
      link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    
    // Estilos personalizados
    const style = document.createElement('style');
    style.textContent = `
      /* Botón flotante transparente - solo ícono */
      #n8n-chat-lenguaje .chat-window-toggle {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        border: none !important;
        box-shadow: none !important;
        width: 60px !important;
        height: 60px !important;
        padding: 0 !important;
      }
      
      #n8n-chat-lenguaje .chat-window-toggle:hover {
        background: transparent !important;
        transform: scale(1.1) !important;
        transition: transform 0.2s ease !important;
      }
      
      #n8n-chat-lenguaje .chat-window-toggle svg {
        width: 60px !important;
        height: 60px !important;
        color: ${COLORS.primary} !important;
        filter: drop-shadow(0 2px 8px rgba(255, 140, 0, 0.3)) !important;
      }
      
      /* Input del chat */
      #n8n-chat-lenguaje .chat-input {
        border: 2px solid #ffe0b3 !important;
        border-radius: 24px !important;
        padding: 14px 20px !important;
      }
      
      #n8n-chat-lenguaje .chat-input:focus {
        border-color: ${COLORS.primary} !important;
        box-shadow: 0 4px 16px rgba(255, 140, 0, 0.3) !important;
      }
      
      /* Botón de enviar */
      #n8n-chat-lenguaje .chat-input-send-button {
        background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%) !important;
        border-radius: 50% !important;
      }
      
      /* Header */
      #n8n-chat-lenguaje .chat-header {
        background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%) !important;
      }
      
      /* Mensajes del usuario */
      #n8n-chat-lenguaje .chat-message-user {
        background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%) !important;
        color: #ffffff !important;
      }
      
      /* Mensajes del bot */
      #n8n-chat-lenguaje .chat-message-bot {
        background: #fff8f0 !important;
      }
    `;
    document.head.appendChild(style);
    
    // Inicializar
    import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js')
      .then(({ createChat }) => {
        createChat({
          webhookUrl: WEBHOOK_URL,
          target: '#n8n-chat-lenguaje',
          mode: 'window',
          showWelcomeScreen: false,
          defaultLanguage: 'es',
          initialMessages: [
            userInfo.firstName !== 'Estudiante' 
              ? `¡Hola ${userInfo.firstName}! 📚 Soy tu tutor de Lenguaje. ¿Estás listo para leer algo interesante hoy o prefieres que repasemos ortografía?`
              : '¡Hola! 📚 Soy tu tutor de Lenguaje. ¿Estás listo para leer algo interesante hoy o prefieres que repasemos ortografía?'
          ],
          i18n: {
            es: {
              title: userInfo.firstName !== 'Estudiante' 
                ? `¡Hola ${userInfo.firstName}! 📖`
                : '¡Hola! 📖',
              subtitle: 'Soy tu Tutor de Lenguaje y Comunicación',
              inputPlaceholder: '¿En qué puedo ayudarte?',
            },
          },
        });
        console.log('✅ Chatbot Lenguaje cargado');
      });
  }
  
  // Ejecutar si estamos en el curso correcto
  if (isInCourse(COURSE_ID)) {
    console.log(`✅ Curso detectado: ${COURSE_NAME} (ID ${COURSE_ID})`);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(loadChatbot, 800));
    } else {
      setTimeout(loadChatbot, 800);
    }
  }
})();
