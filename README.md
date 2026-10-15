# Mailing list

A signup page for a QR code. People enter their name, email, and institution. Submissions are stored only in a Google Sheet.

## Connect the Google Sheet

1. Create a blank Google Sheet.
2. Open **Extensions → Apps Script**, replace the sample code with `google-apps-script/Code.js`, and save.
3. Open **Project Settings → Script properties** and add `SECRET`. Use a long private value.
4. Click **Deploy → New deployment → Web app**.
5. Set **Execute as** to **Me** and **Who has access** to **Anyone**. Copy the web app URL.
6. In Vercel, open the project **Settings → Environment Variables** and add:
   - `GOOGLE_SCRIPT_URL` = the web app URL
   - `SIGNUP_SECRET` = the same value as `SECRET`
7. Redeploy the project after saving the variables.

## Deploy

From this folder:

```bash
npx vercel
```

When Vercel gives you a site address, open `/qr` on that address and print the code. The code points at the site itself and does not expire after 15 days. Open the Google Sheet to see who joined.
