# 🚀 Configuración Google Apps Script para Google Sheets

**¡La forma MÁS SIMPLE y GRATUITA de conectar tu formulario con Google Sheets!**

## ⏱️ Tiempo total: 10 minutos

---

## 📋 **PASO 1: Crear Google Sheet**

1. Ve a [sheets.google.com](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala: **"Anicama - Leads"**
4. **¡IMPORTANTE!** Copia el ID de la URL:
   ```
   https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F7G8H9I0J/edit
                                      ↑ ESTE ES EL ID ↑
   ```

---

## ⚙️ **PASO 2: Crear Google Apps Script**

1. Ve a [script.google.com](https://script.google.com)
2. Haz clic en **"Nuevo proyecto"**
3. **Borra todo el código** que aparece por defecto
4. **Copia y pega** el código del archivo `google-apps-script.js`
5. **IMPORTANTE**: En la línea 15, reemplaza:
   ```javascript
   const SPREADSHEET_ID = 'TU_GOOGLE_SHEET_ID_AQUI';
   ```
   Por:
   ```javascript
   const SPREADSHEET_ID = '1A2B3C4D5E6F7G8H9I0J'; // Tu ID real
   ```

---

## 🚀 **PASO 3: Desplegar como Web App**

1. En Google Apps Script, haz clic en **"Implementar"** → **"Nueva implementación"**
2. Configura:
   - **Tipo**: Aplicación web
   - **Ejecutar como**: Yo (tu email)
   - **Acceso**: Cualquier usuario
3. Haz clic en **"Implementar"**
4. **¡COPIA LA URL!** Se ve así:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

---

## 🔧 **PASO 4: Configurar en tu sitio web**

1. Abre el archivo `script.js`
2. Busca la línea 12:
   ```javascript
   googleAppsScriptUrl: '', // TODO: Reemplazar con la URL de tu Google Apps Script Web App
   ```
3. Reemplaza con tu URL:
   ```javascript
   googleAppsScriptUrl: 'https://script.google.com/macros/s/AKfycbx.../exec',
   ```

---

## ✅ **PASO 5: Probar la integración**

### Opción A: Probar desde Google Apps Script
1. En el editor, selecciona la función `testScript`
2. Haz clic en **"Ejecutar"**
3. Autoriza los permisos cuando se solicite
4. Verifica que aparezcan datos de prueba en tu Google Sheet

### Opción B: Probar desde tu sitio web
1. Completa el formulario en tu página
2. Verifica que los datos aparezcan en Google Sheets
3. ¡Listo! 🎉

---

## 📊 **Estructura de datos en Google Sheets**

Tu hoja tendrá estas columnas automáticamente:

| Timestamp | Nombres | Email | Celular | Empresa | RUC | Cargo | Mensaje | Tipo Formulario | URL Página | Referrer | User Agent | IP Address |
|-----------|---------|-------|---------|---------|-----|-------|---------|----------------|------------|----------|------------|------------|

---

## 🛠️ **Funciones adicionales disponibles**

### Ver estadísticas
```javascript
// Ejecutar en Google Apps Script
getStats()
```

### Limpiar datos (¡cuidado!)
```javascript
// Ejecutar en Google Apps Script
clearSheet()
```

---

## 🔒 **Permisos necesarios**

Google te pedirá autorizar:
- ✅ Acceso a Google Sheets
- ✅ Acceso a Google Drive
- ✅ Ejecutar como aplicación web

**¡Es normal y seguro!** Solo tu script puede acceder a tus datos.

---

## 🚨 **Solución de problemas**

### ❌ "Google Apps Script URL not configured"
- **Solución**: Verifica que hayas pegado correctamente la URL en `script.js`

### ❌ Error 403 (Forbidden)
- **Solución**: Verifica que el acceso esté configurado como "Cualquier usuario"

### ❌ No aparecen datos en Sheets
- **Solución**: Ejecuta `testScript()` en Google Apps Script para verificar permisos

### ❌ Error de CORS
- **Solución**: Google Apps Script maneja CORS automáticamente, verifica la URL

---

## 💰 **Límites gratuitos**

- ✅ **6 horas de ejecución por día**
- ✅ **20,000 triggers por día**
- ✅ **100 MB de almacenamiento**

**Para Anicama es MÁS que suficiente** 🚀

---

## 🎯 **Ventajas de esta solución**

- ✅ **100% Gratuito**
- ✅ **Sin límite de formularios**
- ✅ **Control total de los datos**
- ✅ **Funciona inmediatamente**
- ✅ **Sin dependencias externas**
- ✅ **Respaldo automático en Google**

---

## 📞 **¿Necesitas ayuda?**

Si algo no funciona:
1. Revisa que el ID del Google Sheet sea correcto
2. Verifica que la URL del script esté bien copiada
3. Asegúrate de haber autorizado los permisos
4. Ejecuta `testScript()` para diagnosticar

---

## 🎉 **¡Listo!**

Tu formulario ahora se conecta directamente con Google Sheets. Cada vez que alguien complete el formulario:

1. ✅ Los datos se guardan automáticamente
2. ✅ Se formatean bonito en la hoja
3. ✅ Tienes timestamp de cuándo se envió
4. ✅ Información adicional para seguimiento

**¡Tu integración más simple y poderosa está lista!** 🚀
