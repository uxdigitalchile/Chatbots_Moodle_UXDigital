# 🧮 Chatbot de Matemáticas

Tutor virtual especializado en **Fracciones Matemáticas** para nivel primaria.

## 📊 Configuración

- **Curso ID**: 6
- **Nombre**: Fracciones Matemáticas
- **Color**: Azul Rey (`#0047AB`)
- **Webhook**: `76fb1c45-b2f9-4f6c-bcc2-79a742581288`

## 🔗 Instalación en Moodle

### Método 1: Bloque en el curso (Recomendado)

1. Ve al curso de Matemáticas (ID 6)
2. Activar edición
3. Agregar bloque → "Texto..." o "HTML"
4. Pega este código:

```html
<script src="https://cdn.jsdelivr.net/gh/uxdigitalchile/Chatbots_Moodle_UXDigital@main/matematicas/chatbot.js"></script>
```

5. Guarda

### Método 2: Additional HTML (Global)

1. Administración del sitio → Apariencia → Temas → Additional HTML
2. En el campo `<body>`, pega el mismo script
3. El chatbot solo aparecerá en el curso ID 6

## 🎨 Personalización

Para cambiar colores, edita las constantes en `chatbot.js`:

```javascript
const COLORS = {
  primary: '#0047AB',    // Azul Rey
  secondary: '#1E90FF'   // Azul Dodger
};
```

## 🔧 Workflow en n8n

**URL del webhook**:
```
https://n8n.srv1000857.hstgr.cloud/webhook/76fb1c45-b2f9-4f6c-bcc2-79a742581288/chat
```

**System Prompt**: Ver archivo `system_prompt.txt` (próximamente)

## ✅ Funcionalidades

- ✅ Detección automática del nombre del estudiante
- ✅ Saludo personalizado
- ✅ Pedagogía socrática (no da respuestas directas)
- ✅ Guía paso a paso en resolución de problemas
- ✅ Uso de LaTeX para fórmulas matemáticas
- ✅ Integración con RAG (contenido del curso SCORM)

## 📝 Actualización

Cualquier cambio en este archivo se reflejará automáticamente en Moodle (puede tardar hasta 24h por caché de CDN).

Para forzar actualización inmediata, agrega versión:
```html
<script src="...chatbot.js?v=1.0.1"></script>
```

## 🐛 Troubleshooting

**El chatbot no aparece:**
- Verifica que estás en el curso ID 6
- Abre consola (F12) y busca: `✅ Curso detectado`

**Error "Error in workflow":**
- Verifica que el workflow en n8n esté activo
- Revisa las Executions en n8n para ver el error

## 📞 Soporte

UXDigital Chile  
https://uxdigital.cl
