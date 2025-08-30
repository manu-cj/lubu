# Guide de Déploiement et Configuration - Lubu

## Vue d'ensemble

Ce guide couvre le déploiement de l'application Lubu en production, la configuration des services externes, et la maintenance de l'application.

## 🚀 Déploiement sur Vercel (Recommandé)

### Configuration Initiale

1. **Préparation du projet**
```bash
# Cloner le repository
git clone https://github.com/manu-cj/lubu.git
cd lubu

# Installer les dépendances
npm install

# Tester le build
npm run build
```

2. **Installation Vercel CLI**
```bash
npm install -g vercel
```

3. **Premier déploiement**
```bash
vercel

# Suivre les prompts:
# - Set up and deploy? Yes
# - Which scope? (sélectionner votre compte)
# - Link to existing project? No
# - Project name: lubu
# - Directory: ./
# - Override settings? No
```

### Variables d'Environnement

#### Via Vercel Dashboard
1. Aller sur [vercel.com](https://vercel.com)
2. Sélectionner votre projet
3. Onglet "Settings" → "Environment Variables"

#### Variables Requises
```env
# Base de données MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lubu?retryWrites=true&w=majority

# Secrets JWT (générer des clés fortes)
AUTH_SECRET=your-super-secure-jwt-secret-min-32-characters
REFRESH_SECRET=your-super-secure-refresh-secret-min-32-characters

# Configuration Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-app-email@gmail.com
EMAIL_PASS=your-app-specific-password

# URLs
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
NEXTAUTH_URL=https://your-domain.vercel.app

# Environnement
NODE_ENV=production
```

#### Via CLI Vercel
```bash
# Ajouter les variables une par une
vercel env add MONGODB_URI
vercel env add AUTH_SECRET
vercel env add REFRESH_SECRET

# Ou importer depuis un fichier
vercel env pull .env.production.local
```

### Configuration Vercel.json

Créer `vercel.json` à la racine :
```json
{
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "AUTH_SECRET": "@auth-secret", 
    "REFRESH_SECRET": "@refresh-secret",
    "EMAIL_HOST": "@email-host",
    "EMAIL_PORT": "@email-port",
    "EMAIL_USER": "@email-user",
    "EMAIL_PASS": "@email-pass"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["fra1"],
  "framework": "nextjs"
}
```

### Déploiement Continu

#### GitHub Integration
1. Connecter le repository GitHub dans Vercel
2. Configuration automatique :
   - **Production Branch:** `main`
   - **Deploy Hooks:** Activés
   - **Auto-deployments:** Activés

#### Workflow GitHub Actions (optionnel)
Créer `.github/workflows/deploy.yml` :
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🗄️ Configuration MongoDB

### MongoDB Atlas (Recommandé)

1. **Création du cluster**
   - Aller sur [MongoDB Atlas](https://cloud.mongodb.com)
   - Créer un nouveau cluster
   - Choisir une région proche (Europe West)
   - Tier gratuit M0 pour commencer

2. **Configuration sécurité**
```javascript
// Créer un utilisateur base de données
// Username: lubu-app
// Password: (généré automatiquement)
// Roles: readWrite sur database "lubu"

// Whitelist IP addresses
// 0.0.0.0/0 (toutes les IPs) pour Vercel
// Ou IPs spécifiques pour plus de sécurité
```

3. **String de connexion**
```
mongodb+srv://lubu-app:<password>@cluster0.xxxxx.mongodb.net/lubu?retryWrites=true&w=majority
```

### MongoDB Local (Développement)

#### Installation sur Ubuntu/Debian
```bash
# Importer la clé publique MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Ajouter le repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Installation
sudo apt update
sudo apt install -y mongodb-org

# Démarrage
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Installation avec Docker
```bash
# Créer un container MongoDB
docker run -d \
  --name lubu-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -v lubu-data:/data/db \
  mongo:6.0

# String de connexion locale
MONGODB_URI=mongodb://admin:password123@localhost:27017/lubu?authSource=admin
```

### Optimisations Base de Données

#### Indexes pour Performance
```javascript
// Se connecter à MongoDB
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/lubu"

// Créer les indexes
db.expenses.createIndex({ user_id: 1, date: -1 })
db.expenses.createIndex({ user_id: 1, category_id: 1 })
db.revenues.createIndex({ user_id: 1, date: -1 })
db.revenues.createIndex({ user_id: 1, category_id: 1 })
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })

// Vérifier les indexes
db.expenses.getIndexes()
```

#### Monitoring et Logs
```javascript
// Activer le profiling pour les requêtes lentes
db.setProfilingLevel(1, { slowms: 100 })

// Consulter les requêtes lentes
db.system.profile.find().sort({ ts: -1 }).limit(5)
```

## 📧 Configuration Email

### Gmail SMTP

1. **Activation 2FA sur Gmail**
2. **Génération App Password**
   - Aller dans Paramètres Google Account
   - Sécurité → Mots de passe d'application
   - Générer un mot de passe pour "Lubu App"

3. **Variables d'environnement**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=generated-app-password-16-chars
```

### SendGrid (Alternative)

1. **Compte SendGrid**
   - S'inscrire sur [SendGrid](https://sendgrid.com)
   - Vérifier le domaine d'envoi

2. **Configuration**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

### Test de Configuration Email
```bash
# Créer un script de test
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

transporter.sendMail({
  from: 'your-email@gmail.com',
  to: 'test@example.com',
  subject: 'Test Lubu Email',
  text: 'Configuration email OK!'
}).then(info => {
  console.log('Email envoyé:', info.messageId);
}).catch(err => {
  console.error('Erreur:', err);
});
"
```

## 🔧 Autres Plateformes de Déploiement

### Netlify

1. **Build Settings**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_ENV = "production"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Netlify Functions** (pour API)
```bash
# Installer plugin
npm install @netlify/plugin-nextjs

# Configuration
# Site settings → Build & deploy → Environment variables
```

### Railway

1. **Déploiement**
```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login et deploy
railway login
railway init
railway up
```

2. **Variables d'environnement**
```bash
railway variables set MONGODB_URI="mongodb+srv://..."
railway variables set AUTH_SECRET="your-secret"
```

### Docker + Cloud Providers

#### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Dépendances
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Builder
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  lubu-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/lubu
    depends_on:
      - mongo
    networks:
      - lubu-network

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password123
    networks:
      - lubu-network

volumes:
  mongo-data:

networks:
  lubu-network:
    driver: bridge
```

## 🔒 Sécurité en Production

### HTTPS et Certificats
```javascript
// next.config.ts
const nextConfig = {
  // Force HTTPS en production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};
```

### Variables Sensibles
```bash
# Générer des secrets forts
openssl rand -base64 32  # Pour AUTH_SECRET
openssl rand -base64 32  # Pour REFRESH_SECRET

# Vérifier la force des mots de passe
echo "your-password" | pwquality-check
```

### Rate Limiting
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
  const ip = request.ip || 'anonymous';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return NextResponse.next();
  }

  const { count, resetTime } = rateLimitMap.get(ip);

  if (now > resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return NextResponse.next();
  }

  if (count >= maxRequests) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  rateLimitMap.set(ip, { count: count + 1, resetTime });
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*'
};
```

## 📊 Monitoring et Analytics

### Sentry (Error Tracking)

1. **Installation**
```bash
npm install @sentry/nextjs
```

2. **Configuration**
```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV
});
```

### Vercel Analytics
```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Custom Logging
```typescript
// lib/logger.ts
enum LogLevel {
  INFO = 'info',
  WARN = 'warn', 
  ERROR = 'error'
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export class Logger {
  private static instance: Logger;
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  log(level: LogLevel, message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata
    };
    
    // En développement: console
    if (process.env.NODE_ENV === 'development') {
      console[level](entry);
      return;
    }
    
    // En production: service externe
    this.sendToExternalService(entry);
  }
  
  private async sendToExternalService(entry: LogEntry) {
    // Envoyer à Sentry, DataDog, etc.
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      console.error('Failed to send log:', error);
    }
  }
  
  info(message: string, metadata?: Record<string, any>) {
    this.log(LogLevel.INFO, message, metadata);
  }
  
  warn(message: string, metadata?: Record<string, any>) {
    this.log(LogLevel.WARN, message, metadata);
  }
  
  error(message: string, metadata?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, metadata);
  }
}

export const logger = Logger.getInstance();
```

## 🔧 Maintenance et Mises à Jour

### Scripts de Maintenance
```json
{
  "scripts": {
    "check-health": "node scripts/health-check.js",
    "backup-db": "node scripts/backup-database.js", 
    "cleanup-logs": "node scripts/cleanup-logs.js",
    "update-deps": "npm update && npm audit fix"
  }
}
```

### Health Check
```javascript
// scripts/health-check.js
const https = require('https');
const { connectToDatabase } = require('../app/lib/DbConnect');

async function healthCheck() {
  try {
    // Test API
    const response = await fetch('https://your-domain.vercel.app/api/health');
    if (!response.ok) throw new Error('API health check failed');
    
    // Test Database
    await connectToDatabase();
    console.log('✅ Health check passed');
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    process.exit(1);
  }
}

healthCheck();
```

### Backup Database
```javascript
// scripts/backup-database.js
const { MongoClient } = require('mongodb');
const fs = require('fs');

async function backupDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('lubu');
    
    // Exporter les collections
    const collections = ['users', 'expenses', 'revenues', 'budgets'];
    const backup = {};
    
    for (const collection of collections) {
      backup[collection] = await db.collection(collection).find({}).toArray();
    }
    
    // Sauvegarder dans un fichier
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `backup-${timestamp}.json`;
    
    fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
    console.log(`✅ Backup saved to ${filename}`);
    
  } finally {
    await client.close();
  }
}

backupDatabase();
```

### Automatisation avec Cron
```bash
# Ajouter au crontab
crontab -e

# Backup quotidien à 2h du matin
0 2 * * * cd /path/to/lubu && npm run backup-db

# Health check toutes les heures
0 * * * * cd /path/to/lubu && npm run check-health

# Nettoyage des logs hebdomadaire
0 0 * * 0 cd /path/to/lubu && npm run cleanup-logs
```

## 🚨 Troubleshooting Production

### Logs Vercel
```bash
# Consulter les logs
vercel logs

# Logs en temps réel
vercel logs --follow

# Logs d'une fonction spécifique
vercel logs --since=1h --filter=api/auth
```

### Debug Issues Communes

#### Build Failures
```bash
# Vérifier les dépendances
npm ls
npm audit

# Build local pour reproduire
npm run build

# Vérifier les variables d'environnement
vercel env ls
```

#### Database Connection Issues
```javascript
// Test de connexion simple
const { MongoClient } = require('mongodb');

async function testConnection() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ Database connected');
    await client.close();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}
```

#### Performance Issues
```bash
# Analyser le bundle
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build

# Vérifier les Core Web Vitals
# Google PageSpeed Insights
# Vercel Analytics
```

---

*Ce guide de déploiement est maintenu à jour avec les meilleures pratiques. Consultez la documentation officielle de chaque service pour les dernières informations.*