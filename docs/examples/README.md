# Environment Configuration

This directory contains example environment files for the Angular application.

## Setup Instructions

1. **Copy the example files to your `src/environments/` directory:**
   ```bash
   cp docs/examples/environment.example.ts src/environments/environment.ts
   cp docs/examples/environment.development.example.ts src/environments/environment.development.ts
   cp docs/examples/environment.prod.example.ts src/environments/environment.production.ts
   ```

2. **Update the values** in your copied files with your actual configuration:
   - Replace `apiBaseUrl` with your actual API endpoints
   - Adjust other settings as needed for your environment

## Environment Files

### `environment.example.ts`
Default development environment configuration. Points to local backend at `http://localhost:3000/api`.

### `environment.prod.example.ts` 
Production environment configuration with security-focused settings.

## Required Variables

Your app requires these environment variables:

- **`apiBaseUrl`** - Backend API base URL (used by AuthService and UsersService)
- **`production`** - Angular production flag

## Security Note

⚠️ **Never commit actual environment files** - The `src/environments/` directory is ignored by git to prevent accidental exposure of sensitive data.
