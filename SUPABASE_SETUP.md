# Supabase Setup Guide

## Getting Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. You'll find:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Configuration Steps

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** and replace the placeholder values:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

3. **Restart your Expo development server:**
   ```bash
   pnpm expo start -c
   ```
   The `-c` flag clears the cache to ensure new environment variables are loaded.

## Important Notes

- ✅ The `.env` file is already in `.gitignore` - your secrets won't be committed
- ✅ Use `EXPO_PUBLIC_` prefix for client-side environment variables
- ⚠️ Never commit your actual `.env` file to version control
- ⚠️ The `anon` key is safe to use in the client (it's public)
- ⚠️ Never expose your `service_role` key in client code

## Testing the Connection

After setting up your credentials, you can test the connection by checking the console logs when the app starts. If the credentials are missing, you'll see a warning message.

## Troubleshooting

If environment variables aren't loading:
1. Make sure you've created the `.env` file in the project root
2. Restart the Expo server with the `-c` flag to clear cache
3. Check that variable names match exactly (case-sensitive)
4. Verify `app.config.js` is being used (not `app.json`)
