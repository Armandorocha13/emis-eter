import { google } from 'googleapis';
import * as XLSX from 'xlsx';

/**
 * Utility to fetch and convert Google Drive Excel files to JSON
 * Designed for Vercel Serverless Environments
 */
export async function downloadDriveExcelAsJson(fileId: string) {
  // 1. Validate Environment Variables
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    const missing = !clientEmail ? 'GOOGLE_SERVICE_ACCOUNT_EMAIL' : 'GOOGLE_PRIVATE_KEY';
    console.error(`[Google Drive Auth Error]: Missing environment variable: ${missing}`);
    throw new Error(`Authentication configuration missing: ${missing}`);
  }

  if (!fileId) {
    console.error('[Google Drive Error]: No File ID provided for download');
    throw new Error('File ID is required');
  }

  try {
    // 2. Authenticate with Google
    console.log(`[Google Drive]: Authenticating for file ${fileId}...`);
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        // Ensure private key handles escaped newlines from Vercel/Env accurately
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // 3. Download file as ArrayBuffer
    console.log(`[Google Drive]: Attempting to download file content...`);
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );

    if (!response.data) {
      throw new Error('Empty response from Google Drive');
    }

    // 4. Parse Buffer with XLSX
    console.log(`[Google Drive]: File downloaded. Parsing with XLSX...`);
    const buffer = Buffer.from(response.data as ArrayBuffer);
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
    
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
    console.log(`[Google Drive Success]: Processed ${jsonData.length} rows from sheet "${firstSheetName}"`);
    
    return jsonData;

  } catch (error: any) {
    // 5. Deep Logging for Vercel Debugging
    console.error('--- GOOGLE DRIVE DEBUG ERROR ---');
    console.error(`Timestamp: ${new Date().toISOString()}`);
    console.error(`Target File ID: ${fileId}`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Status Text: ${error.response.statusText}`);
      console.error('Data:', error.response.data);
    } else {
      console.error(`Message: ${error.message}`);
    }
    console.error('--------------------------------');

    throw new Error(`Google Drive Integration failed: ${error.message}`);
  }
}

/**
 * Legacy wrapper for previous implementations if needed
 */
export async function getExcelData(fileId: string, tipo: 'EMIS' | 'ETER') {
  const data = await downloadDriveExcelAsJson(fileId);
  return { data }; // Basic wrapper to match expected structure
}
