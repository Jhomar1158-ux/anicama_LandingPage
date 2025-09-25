# Configuración del Webhook de Make.com para Google Sheets

Esta guía te ayudará a configurar la integración entre tu formulario de contacto y Google Sheets usando Make.com.

## Pasos para configurar Make.com

### 1. Crear una cuenta en Make.com
- Ve a [make.com](https://www.make.com)
- Crea una cuenta gratuita o inicia sesión si ya tienes una

### 2. Crear un nuevo escenario
- Haz clic en "Create a new scenario"
- Busca y selecciona "Webhooks" como trigger

### 3. Configurar el Webhook
- Selecciona "Custom webhook"
- Haz clic en "Add" para crear un nuevo webhook
- Copia la URL del webhook que se genera (algo como: `https://hook.eu1.make.com/xxxxxxxxxx`)

### 4. Configurar Google Sheets
- Agrega un módulo de Google Sheets
- Conecta tu cuenta de Google
- Selecciona "Add a row" como acción
- Configura los siguientes campos:

#### Estructura recomendada para las columnas en Google Sheets:
| Columna A | Columna B | Columna C | Columna D | Columna E | Columna F | Columna G | Columna H | Columna I | Columna J | Columna K | Columna L |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| Timestamp | Nombres | Email | Celular | Empresa | RUC | Cargo | Mensaje | Tipo Formulario | URL Página | Referrer | User Agent |

#### Mapeo de campos en Make.com:
- **Timestamp**: `{{1.timestamp}}`
- **Nombres**: `{{1.nombres}}`
- **Email**: `{{1.email}}`
- **Celular**: `{{1.celular}}`
- **Empresa**: `{{1.empresa}}`
- **RUC**: `{{1.ruc}}`
- **Cargo**: `{{1.cargo}}`
- **Mensaje**: `{{1.mensaje}}`
- **Tipo Formulario**: `{{1.form_type}}`
- **URL Página**: `{{1.page_url}}`
- **Referrer**: `{{1.referrer}}`
- **User Agent**: `{{1.user_agent}}`

### 5. Probar el webhook
- Guarda y activa el escenario en Make.com
- En tu código JavaScript, actualiza la configuración:

```javascript
const CONFIG = {
  // ... otras configuraciones
  form: {
    makeWebhookUrl: 'TU_URL_DEL_WEBHOOK_AQUÍ', // Reemplaza con la URL copiada de Make.com
    timeout: 10000
  }
};
```

### 6. Configurar en tu sitio web
1. Abre el archivo `script.js`
2. Busca la línea que dice: `makeWebhookUrl: '',`
3. Reemplaza el valor vacío con la URL de tu webhook de Make.com:
   ```javascript
   makeWebhookUrl: 'https://hook.eu1.make.com/tu-webhook-id-aquí',
   ```

## Estructura de datos que se envían

El formulario envía los siguientes datos al webhook:

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "source": "anicama_landing_page",
  "form_type": "hero_form", // o "contact_form"
  "nombres": "Nombre del cliente",
  "email": "email@ejemplo.com",
  "celular": "987654321",
  "empresa": "Nombre de la empresa",
  "ruc": "12345678901",
  "cargo": "Gerente General",
  "mensaje": "Mensaje del cliente",
  "page_url": "https://tu-sitio.com",
  "user_agent": "Mozilla/5.0...",
  "referrer": "https://google.com"
}
```

## Pruebas

### Para probar la integración:
1. Completa el formulario en tu página web
2. Verifica que los datos aparezcan en Google Sheets
3. Revisa los logs en Make.com para detectar posibles errores

### Solución de problemas:
- **Error "webhook URL not configured"**: Asegúrate de haber configurado la URL del webhook en `script.js`
- **Error de conexión**: Verifica que la URL del webhook sea correcta
- **Datos no aparecen en Sheets**: Revisa el mapeo de campos en Make.com
- **Error 429 (Too Many Requests)**: Make.com tiene límites de uso en el plan gratuito

## Límites del plan gratuito de Make.com
- 1,000 operaciones por mes
- 2 escenarios activos
- Ejecuciones cada 15 minutos

Para sitios con mucho tráfico, considera actualizar a un plan de pago.

## Seguridad adicional (opcional)
Para mayor seguridad, puedes:
1. Agregar autenticación en el webhook
2. Validar el origen de las peticiones
3. Configurar filtros en Make.com para datos específicos

¡Tu integración está lista! Los datos del formulario se guardarán automáticamente en Google Sheets cada vez que alguien complete el formulario.
