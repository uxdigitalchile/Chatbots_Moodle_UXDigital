/**
 * =======================================================
 * AGENTE MAESTRO UXDIGITAL (Matemáticas + Lenguaje)
 * Versión: 2.0 (GitHub Pages Edition)
 * =======================================================
 */

(function() {
  'use strict';

  // --- 1. CONFIGURACIÓN GENERAL ---
  const CONFIG = {
    // Avatar Transparente (Tutor Biología Pro)
    avatar: 'https://uxdigital.cl/wp-content/uploads/2025/01/tutor-biologia-pro.gif',
    
    // Configuración por ID de Curso
    courses: {
      // CURSO LENGUAJE (ID 4)
      4: {
        name: 'Lenguaje y Comunicación',
        webhook: 'https://n8n.srv1000857.hstgr.cloud/webhook/5979f63d-4dac-46cd-9aa8-e74d7a927b27/chat',
        colors: { primary: '#FF8C00', secondary: '#FFA500' }, // Naranja
        emoji: '📖',
        greeting: '¡Hola {nombre}! 📚 Soy tu tutor de Lenguaje. ¿Listo para aprender?',
        subtitle: 'Tutor de Lenguaje y Comunicación'
      },
      
      // CURSO MATEMÁTICAS (ID 6)
      6: {
        name: 'Fracciones Matemáticas',
        webhook: 'https://n8n.srv1000857.hstgr.cloud/webhook/76fb1c45-b2f9-4f6c-bcc2-79a742581288/chat',
        colors: { primary: '#0047AB', secondary: '#1E90FF' }, // Azul
        emoji: '🧮',
        greeting: '¡Hola {nombre}! 👋 Soy tu tutor de matemáticas. ¿En qué puedo ayudarte hoy?',
        subtitle: 'Tutor virtual de Matemáticas'
      }
    }
  };

  // --- 2. DETECTOR DE CURSO ---
  function getCurrentCourseId() {
    // Intenta obtener ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlId = parseInt(urlParams.get('id'));
    if (urlId) return urlId;

    // Intenta obtener ID de Moodle Config
    if (typeof M !== 'undefined' && M.cfg && M.cfg.courseId) {
      return parseInt(M.cfg.courseId);
    }
    
    // Intenta obtener ID de las clases del Body
    const bodyMatch = document.body.className.match(/course-(\d+)/);
    return bodyMatch ? parseInt(bodyMatch[1]) : 0;
  }

  // --- 3. OBTENER NOMBRE DEL ESTUDIANTE ---
  function getUserInfo() {
    let userName = '';
    try {
      const userMenuToggle = document.querySelector('#user-menu-toggle');
      if (userMenuToggle) {
        const clone = userMenuToggle.cloneNode(true);
        Array.from(clone.children).forEach(child => child.remove());
        userName = clone.textContent.trim().split(' - ')[0].trim();
      }
    } catch(e) { console.warn('No se pudo detectar usuario'); }
    
    return {
      firstName: userName ? userName.split(' ')[0] : 'Estudiante'
    };
  }

  // --- 4. INICIALIZACIÓN ---
  const currentId = getCurrentCourseId();
  const activeCourse = CONFIG.courses[currentId];

  // Si no estamos en un curso válido, detenemos el script
  if (!activeCourse) return;

  setTimeout(() => {
    const userInfo = getUserInfo();
    const container = document.createElement('div');
    container.id = 'n8n-chat';
    document.body.appendChild(container);

    // --- 5. INYECCIÓN DE CSS (CORRECCIONES VISUALES) ---
    const style = document.createElement('style');
    style.innerHTML = `
      /* Colores Dinámicos */
      #n8n-chat .chat-header { 
        background: linear-gradient(135deg, ${activeCourse.colors.primary} 0%, ${activeCourse.colors.secondary} 100%) !important; 
      }
      #n8n-chat .chat-message-user { 
        background: linear-gradient(135deg, ${activeCourse.colors.primary} 0%, ${activeCourse.colors.secondary} 100%) !important; 
        color: #fff !important; 
      }
      #n8n-chat .chat-input-send-button { 
        background: ${activeCourse.colors.primary} !important; 
      }

      /* === ZONA CRÍTICA: CORRECCIÓN DE AVATAR === */
      
      /* Resetear variables nativas de n8n */
      :root {
        --chat--toggle--background: transparent !important;
        --chat--toggle--hover--background: transparent !important;
      }

      #n8n-chat .chat-window-toggle {
        /* Fondo transparente + Imagen del GIF */
        background: transparent url('${CONFIG.avatar}') no-repeat center bottom !important;
        
        /* 'contain' asegura que la imagen NUNCA se corte */
        background-size: contain !important; 
        
        /* Dimensiones fijas y limpieza de bordes */
        width: 140px !important;
        height: 140px !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }

      /* OCULTAR EL GLOBO BLANCO (Icono SVG) */
      #n8n-chat .chat-window-toggle svg {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        width: 0 !important;
      }

      /* Efecto Hover suave */
      #n8n-chat .chat-window-toggle:hover {
        transform: scale(1.05);
        transition: transform 0.2s ease;
      }
    `;
    document.head.appendChild(style);

    // Cargar librería de n8n
    if (!document.querySelector('link[href*="n8n/chat"]')) {
      const link = document.createElement('link');
      link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    // --- 6. CARGAR EL CHAT ---
    import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js')
      .then(({ createChat }) => {
        createChat({
          webhookUrl: activeCourse.webhook,
          target: '#n8n-chat',
          mode: 'window',
          chatInputKey: 'chatInput',
          chatSessionKey: 'sessionId',
          loadPreviousSession: true,
          showWelcomeScreen: false,
          defaultLanguage: 'es',
          initialMessages: [
            activeCourse.greeting.replace('{nombre}', userInfo.firstName)
          ],
          i18n: {
            es: {
              title: `¡Hola ${userInfo.firstName}! ${activeCourse.emoji}`,
              subtitle: activeCourse.subtitle,
              getStarted: 'Empezar',
              inputPlaceholder: '¿En qué puedo ayudarte?',
            },
          },
        });

        // --- 7. VIGILANTE DE SEGURIDAD (ANTI-GLOBO) ---
        // Se asegura de borrar el globo blanco si n8n intenta pintarlo de nuevo
        let checks = 0;
        const cleaner = setInterval(() => {
            const svg = document.querySelector('#n8n-chat .chat-window-toggle svg');
            if(svg) svg.style.display = 'none';
            
            checks++;
            if(checks > 20) clearInterval(cleaner); // Revisa durante 10 segundos
        }, 500);
      });
  }, 1000); // Espera 1s para asegurar carga de Moodle
})();
