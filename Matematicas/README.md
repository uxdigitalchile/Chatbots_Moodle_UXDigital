# 🧮 Chatbot de Matemáticas

Tutor virtual para el curso de **Fracciones Matemáticas**.

## 📊 Configuración Actual

```javascript
courseId: 6
courseName: 'Fracciones Matemáticas'
webhookUrl: '...76fb1c45...'
avatarUrl: 'https://uxdigital.cl/.../bot-uxdigital.gif'
colors: Azul Rey (#0047AB / #1E90FF)
emoji: 🧮
```

## 🎨 Cambiar el Avatar/GIF

Para cambiar el GIF del chatbot:

1. Sube tu GIF a un servidor (ej: WordPress, Imgur, etc.)
2. Asegúrate de que tenga **fondo transparente**
3. Abre `chatbot.js` en GitHub
4. Busca la línea 12:
   ```javascript
   avatarUrl: 'https://uxdigital.cl/wp-content/uploads/2025/01/bot-uxdigital.gif',
   ```
5. Reemplaza la URL con tu GIF
6. **Commit changes**

**Para usar el ícono por defecto** (sin GIF):
```javascript
avatarUrl: null,
```

## 🎨 Cambiar Colores

Edita las líneas 14-17:
```javascript
colors: {
  primary: '#0047AB',      // Color principal
  secondary: '#1E90FF'     // Color para degradados
},
```

**Ejemplos de colores:**
- Verde: `#00AA00` / `#00DD00`
- Rojo: `#CC0000` / `#FF0000`
- Morado: `#6A0DAD` / `#9370DB`

## 🔗 Instalación en Moodle

```html
<script src="https://cdn.jsdelivr.net/gh/uxdigitalchile/Chatbots_Moodle_UXDigital@main/Matematicas/chatbot.js"></script>
```

## 📝 Personalizar Mensajes

Edita las líneas 20-26 en `chatbot.js`:
```javascript
messages: {
  greeting: '¡Hola {nombre}! 👋 Tu mensaje aquí...',
  greetingAnonymous: 'Mensaje sin nombre...',
  subtitle: 'Subtítulo del chatbot',
  placeholder: 'Texto del input...'
}
```

## ✅ Checklist de Personalización

- [ ] Cambiar `avatarUrl` si quieres otro GIF
- [ ] Ajustar `colors.primary` y `colors.secondary`
- [ ] Personalizar mensajes de `greeting` y `subtitle`
- [ ] Cambiar `emoji` si quieres otro ícono
- [ ] Commit changes en GitHub
- [ ] Esperar 5-30 min para que se actualice el CDN
- [ ] Refrescar Moodle con Ctrl+Shift+R

## 🐛 Troubleshooting

**El avatar sigue con fondo de color:**
- Verifica que tu GIF tenga fondo transparente
- Prueba con: `https://uxdigital.cl/wp-content/uploads/2025/01/bot-uxdigital.gif`

**Los cambios no se ven:**
- Limpia caché: Ctrl+Shift+R
- Espera 30 minutos (caché de jsDelivr)
- Agrega `?v=2` al final del script en Moodle

## 📞 Soporte

UXDigital Chile  
https://uxdigital.cl
