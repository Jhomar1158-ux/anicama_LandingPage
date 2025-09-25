/**
 * Google Apps Script para recibir datos del formulario de Anicama
 * y guardarlos automáticamente en Google Sheets
 * 
 * INSTRUCCIONES DE CONFIGURACIÓN:
 * 1. Ve a script.google.com
 * 2. Crea un nuevo proyecto
 * 3. Pega este código
 * 4. Configura el ID de tu Google Sheet (línea 15)
 * 5. Despliega como Web App
 * 6. Copia la URL y úsala en tu script.js
 */

// ========== CONFIGURACIÓN ==========
const SPREADSHEET_ID = '164FHAFpr-a0YXNtVOS2a3KqTcVhcgDdXl4Yzc4-1J0Y'; // ID de tu Google Sheet
const SHEET_NAME = 'Leads'; // Nombre de la hoja (puedes cambiarlo)

// ========== FUNCIÓN PRINCIPAL ==========
function doPost(e) {
  try {
    // Parsear los datos recibidos
    const data = JSON.parse(e.postData.contents);
    console.log('Datos recibidos:', data);
    
    // Validar datos requeridos
    if (!data.nombres || !data.email) {
      return createResponse(400, 'Faltan datos requeridos: nombres y email');
    }
    
    // Obtener la hoja de cálculo
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Si la hoja no existe, crearla con encabezados
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      setupHeaders(sheet);
    } else {
      // Si la hoja existe pero no tiene encabezados, agregarlos
      const firstRow = sheet.getRange(1, 1, 1, 13).getValues()[0];
      const hasHeaders = firstRow.some(cell => cell && cell.toString().trim() !== '');
      
      if (!hasHeaders) {
        setupHeaders(sheet);
      }
    }
    
    // Agregar los datos a la hoja
    const success = addDataToSheet(sheet, data);
    
    if (success) {
      return createResponse(200, 'Datos guardados exitosamente');
    } else {
      return createResponse(500, 'Error al guardar los datos');
    }
    
  } catch (error) {
    console.error('Error en doPost:', error);
    return createResponse(500, 'Error interno del servidor: ' + error.message);
  }
}

// ========== FUNCIÓN PARA MANEJAR GET (OPCIONAL) ==========
function doGet(e) {
  return createResponse(200, 'Google Apps Script funcionando correctamente. Usa POST para enviar datos.');
}

// ========== FUNCIÓN PARA MANEJAR OPTIONS (PREFLIGHT CORS) ==========
function doOptions(e) {
  return createResponse(200, 'CORS preflight response');
}

// ========== CONFIGURAR ENCABEZADOS DE LA HOJA ==========
function setupHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Nombres',
    'Email', 
    'Celular',
    'Empresa',
    'RUC',
    'Cargo',
    'Mensaje',
    'Tipo Formulario',
    'URL Página',
    'Referrer',
    'User Agent',
    'IP Address'
  ];
  
  // Agregar encabezados en la primera fila
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatear encabezados
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  
  // Ajustar ancho de columnas
  sheet.autoResizeColumns(1, headers.length);
  
  console.log('Encabezados configurados');
}

// ========== AGREGAR DATOS A LA HOJA ==========
function addDataToSheet(sheet, data) {
  try {
    const timestamp = new Date();
    
    // Preparar los datos en el orden de las columnas
    const rowData = [
      timestamp,                           // Timestamp
      data.nombres || '',                  // Nombres
      data.email || '',                    // Email
      data.celular || '',                  // Celular
      data.empresa || '',                  // Empresa
      data.ruc || '',                      // RUC
      data.cargo || '',                    // Cargo
      data.mensaje || '',                  // Mensaje
      data.form_type || 'unknown',         // Tipo Formulario
      data.page_url || '',                 // URL Página
      data.referrer || '',                 // Referrer
      data.user_agent || '',               // User Agent
      data.ip_address || getClientIP()     // IP Address
    ];
    
    // Agregar la fila
    sheet.appendRow(rowData);
    
    // Formatear la nueva fila
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow, 1, 1, rowData.length);
    
    // Alternar color de filas para mejor legibilidad
    if (lastRow % 2 === 0) {
      range.setBackground('#f8f9fa');
    }
    
    // Formatear timestamp
    sheet.getRange(lastRow, 1).setNumberFormat('dd/mm/yyyy hh:mm:ss');
    
    console.log('Datos agregados en la fila:', lastRow);
    return true;
    
  } catch (error) {
    console.error('Error al agregar datos:', error);
    return false;
  }
}

// ========== CREAR RESPUESTA HTTP ==========
function createResponse(status, message) {
  const response = {
    status: status,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
}

// ========== OBTENER IP DEL CLIENTE (LIMITADO EN APPS SCRIPT) ==========
function getClientIP() {
  // Apps Script tiene limitaciones para obtener IP real del cliente
  // Esto es más para completitud, puede no funcionar siempre
  try {
    return Session.getTemporaryActiveUserKey() || 'Unknown';
  } catch (error) {
    return 'Unknown';
  }
}

// ========== FUNCIONES DE UTILIDAD ==========

/**
 * Función para probar el script manualmente
 * Ejecuta esta función para verificar que todo funciona
 */
function testScript() {
  const testData = {
    nombres: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    celular: '987654321',
    empresa: 'Empresa Test',
    ruc: '12345678901',
    mensaje: 'Mensaje de prueba',
    form_type: 'test',
    page_url: 'https://test.com',
    referrer: 'https://google.com',
    user_agent: 'Test User Agent'
  };
  
  // Simular una petición POST
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Resultado de la prueba:', result.getContent());
}

/**
 * Función para agregar encabezados a la hoja actual
 */
function addHeadersToCurrentSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getActiveSheet(); // Usar la hoja activa
  
  // Insertar una fila al principio
  sheet.insertRowBefore(1);
  
  // Agregar encabezados
  setupHeaders(sheet);
  
  console.log('Encabezados agregados a la hoja actual');
}

/**
 * Función para limpiar la hoja (usar con cuidado)
 */
function clearSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (sheet) {
    sheet.clear();
    setupHeaders(sheet);
    console.log('Hoja limpiada y encabezados reconfigurados');
  }
}

/**
 * Función para obtener estadísticas básicas
 */
function getStats() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (sheet) {
    const lastRow = sheet.getLastRow();
    const totalLeads = lastRow - 1; // Restar encabezados
    
    console.log('Total de leads:', totalLeads);
    console.log('Última actualización:', new Date());
    
    return {
      totalLeads: totalLeads,
      lastUpdate: new Date()
    };
  }
  
  return { totalLeads: 0, lastUpdate: null };
}
