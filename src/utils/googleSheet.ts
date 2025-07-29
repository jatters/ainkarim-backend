import { google } from 'googleapis';

export async function appendRows(values: any[][], sheetName = 'Reservas') {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GSHEET_CLIENT_EMAIL,
      // Reconvertimos los \n escapados
      private_key: process.env.GSHEET_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const sheetId = process.env.GSHEET_ID as string;

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${sheetName}!A2`,         // Hoja “Reservas”
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}