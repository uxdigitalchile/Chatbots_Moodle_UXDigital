# 📖 Chatbot de Lenguaje y Comunicación

Tutor virtual especializado en **Lectura, Escritura y Gramática** para nivel primaria.

## 📊 Configuración

- **Curso ID**: 4
- **Nombre**: Lenguaje y Comunicación
- **Color**: Naranja (`#FF8C00`)
- **Webhook**: `5979f63d-4dac-46cd-9aa8-e74d7a927b27`

## 🔗 Instalación en Moodle

### Método 1: Bloque en el curso (Recomendado)

1. Ve al curso de Lenguaje (ID 4)
2. Activar edición
3. Agregar bloque → "Texto..." o "HTML"
4. Pega este código:

```html
<script src="https://cdn.jsdelivr.net/gh/uxdigitalchile/Chatbots_Moodle_UXDigital@main/lenguaje/chatbot.js"></script>
```

5. Guarda

### Método 2: Additional HTML (Global)

1. Administración del sitio → Apariencia → Temas → Additional HTML
2. En el campo `<body>`, pega el mismo script
3. El chatbot solo aparecerá en el curso ID 4

## 🎨 Personalización

Para cambiar colores, edita las constantes en `chatbot.js`:

```javascript
const COLORS = {
  primary: '#FF8C00',    // Naranja oscuro
  secondary: '#FFA500'   // Naranja
};
```

## 🔧 Workflow en n8n

**URL del webhook**:
```
https://n8n.srv1000857.hstgr.cloud/webhook/5979f63d-4dac-46cd-9aa8-e74d7a927b27/chat
```

**System Prompt**: Ver archivo `system_prompt.txt` (próximamente)

## ✅ Funcionalidades

- ✅ Detección automática del nombre del estudiante
- ✅ Saludo personalizado
- ✅ Pedagogía socrática (no da respuestas directas)
- ✅ Corrección con empatía ("Sandwich pedagógico")
- ✅ Guía en comprensión lectora y ortografía
- ✅ Emojis para hacer la conversación amigable
- ✅ Integración con RAG (lecturas y contenido del curso)

## 📝 Actualización

Cualquier cambio en este archivo se reflejará automáticamente en Moodle (puede tardar hasta 24h por caché de CDN).

Para forzar actualización inmediata, agrega versión:
```html
<script src="...chatbot.js?v=1.0.1"></script>
```

## 🐛 Troubleshooting

**El chatbot no aparece:**
- Verifica que estás en el curso ID 4
- Abre consola (F12) y busca: `✅ Curso detectado`

**Error "Error in workflow":**
- Verifica que el workflow en n8n esté activo
- Revisa las Executions en n8n para ver el error

## 📞 Soporte

UXDigital Chile  
https://uxdigital.cl
