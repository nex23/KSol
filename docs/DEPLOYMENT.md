# Guía de Despliegue - KSol

## Opciones de Despliegue

KSol puede desplegarse en varias plataformas. A continuación se detallan las opciones más populares.

## 1. Despliegue en Manus Platform

**Ventajas:** Integración nativa con Manus OAuth, despliegue automático, base de datos incluida.

### Pasos

1. **Conectar repositorio:**
   ```bash
   git remote add manus https://git.manus.im/tu-usuario/ksol.git
   ```

2. **Configurar variables de entorno:**
   - Ve a Manus Dashboard
   - Configura todas las variables en Settings → Secrets

3. **Desplegar:**
   ```bash
   git push manus main
   ```

4. **Verificar despliegue:**
   - Ve a Manus Dashboard
   - Verifica el estado del despliegue
   - Accede a tu aplicación en `https://ksol.manus.space`

### Variables de Entorno Requeridas

```env
DATABASE_URL=postgresql://...
JWT_SECRET=tu-secreto-muy-seguro
VITE_APP_ID=tu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
OWNER_NAME=Tu Nombre
OWNER_OPEN_ID=tu-open-id
VITE_APP_TITLE=KSol
VITE_APP_LOGO=/logo.svg
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=tu-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=tu-frontend-api-key
```

## 2. Despliegue en Vercel (Frontend) + Railway (Backend)

**Ventajas:** Rendimiento optimizado, escalabilidad automática, CDN global.

### Despliegue del Frontend en Vercel

1. **Conectar repositorio:**
   - Ve a [Vercel](https://vercel.com)
   - Haz clic en "New Project"
   - Selecciona tu repositorio de GitHub

2. **Configurar build:**
   - Framework: Other
   - Build Command: `pnpm build`
   - Output Directory: `dist`

3. **Configurar variables de entorno:**
   - `VITE_APP_ID`
   - `VITE_OAUTH_PORTAL_URL`
   - `VITE_APP_TITLE`
   - `VITE_APP_LOGO`
   - `VITE_FRONTEND_FORGE_API_URL`
   - `VITE_FRONTEND_FORGE_API_KEY`

4. **Desplegar:**
   - Haz clic en "Deploy"
   - Verifica que la compilación sea exitosa

### Despliegue del Backend en Railway

1. **Crear proyecto:**
   - Ve a [Railway](https://railway.app)
   - Haz clic en "New Project"
   - Selecciona "Deploy from GitHub"

2. **Configurar servicio:**
   - Selecciona tu repositorio
   - Configura el comando de inicio: `pnpm start`

3. **Agregar PostgreSQL:**
   - Haz clic en "Add Service"
   - Selecciona "PostgreSQL"
   - Railway creará automáticamente `DATABASE_URL`

4. **Configurar variables de entorno:**
   - `JWT_SECRET`
   - `VITE_APP_ID`
   - `OAUTH_SERVER_URL`
   - `OWNER_NAME`
   - `OWNER_OPEN_ID`
   - Todas las demás variables necesarias

5. **Desplegar:**
   - Railway desplegará automáticamente
   - Obtén la URL del backend

### Conectar Frontend y Backend

En Vercel, actualiza las variables de entorno:

```env
VITE_FRONTEND_FORGE_API_URL=https://tu-backend.railway.app
```

## 3. Despliegue con Docker

**Ventajas:** Portabilidad, consistencia entre entornos, fácil escalabilidad.

### Crear Dockerfile

```dockerfile
# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Compilar
RUN pnpm build

# Runtime stage
FROM node:22-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar solo dependencias de producción
RUN pnpm install --frozen-lockfile --prod

# Copiar build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["pnpm", "start"]
```

### Crear docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ksol
      POSTGRES_USER: ksol_user
      POSTGRES_PASSWORD: tu_contraseña_segura
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://ksol_user:tu_contraseña_segura@postgres:5432/ksol
      JWT_SECRET: tu_secreto_muy_seguro
      VITE_APP_ID: tu_app_id
      # ... otras variables
    depends_on:
      - postgres
    command: sh -c "pnpm db:push && pnpm start"

volumes:
  postgres_data:
```

### Desplegar con Docker

```bash
# Compilar imagen
docker build -t ksol:latest .

# Ejecutar contenedor
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Detener
docker-compose down
```

## 4. Despliegue en AWS

**Ventajas:** Escalabilidad empresarial, múltiples opciones de hosting.

### Opción A: AWS Elastic Beanstalk

1. **Instalar EB CLI:**
   ```bash
   pip install awsebcli
   ```

2. **Inicializar aplicación:**
   ```bash
   eb init -p node.js-22 ksol
   ```

3. **Crear entorno:**
   ```bash
   eb create ksol-env
   ```

4. **Configurar variables de entorno:**
   ```bash
   eb setenv DATABASE_URL=... JWT_SECRET=... ...
   ```

5. **Desplegar:**
   ```bash
   eb deploy
   ```

### Opción B: AWS ECS + RDS

1. **Crear cluster ECS**
2. **Crear instancia RDS PostgreSQL**
3. **Crear task definition con Docker**
4. **Desplegar servicio**

## 5. Despliegue en DigitalOcean

**Ventajas:** Precio accesible, interfaz simple, buena documentación.

### Pasos

1. **Crear Droplet:**
   - Ve a DigitalOcean
   - Crea un nuevo Droplet con Ubuntu 22.04
   - Tamaño: 2GB RAM mínimo

2. **Conectar por SSH:**
   ```bash
   ssh root@tu_ip_droplet
   ```

3. **Instalar dependencias:**
   ```bash
   apt update && apt upgrade -y
   apt install -y nodejs npm postgresql postgresql-contrib
   npm install -g pnpm
   ```

4. **Clonar repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/ksol.git
   cd ksol
   ```

5. **Configurar base de datos:**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE ksol;
   CREATE USER ksol_user WITH PASSWORD 'contraseña_segura';
   GRANT ALL PRIVILEGES ON DATABASE ksol TO ksol_user;
   \q
   ```

6. **Instalar dependencias del proyecto:**
   ```bash
   pnpm install
   ```

7. **Configurar variables de entorno:**
   ```bash
   nano .env.production
   ```

8. **Ejecutar migraciones:**
   ```bash
   pnpm db:push
   ```

9. **Compilar para producción:**
   ```bash
   pnpm build
   ```

10. **Configurar PM2 (gestor de procesos):**
    ```bash
    npm install -g pm2
    pm2 start "pnpm start" --name ksol
    pm2 startup
    pm2 save
    ```

11. **Configurar Nginx (reverse proxy):**
    ```bash
    apt install -y nginx
    ```

    Crear `/etc/nginx/sites-available/ksol`:
    ```nginx
    server {
        listen 80;
        server_name tu-dominio.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

    Activar sitio:
    ```bash
    ln -s /etc/nginx/sites-available/ksol /etc/nginx/sites-enabled/
    nginx -t
    systemctl restart nginx
    ```

12. **Configurar SSL con Certbot:**
    ```bash
    apt install -y certbot python3-certbot-nginx
    certbot --nginx -d tu-dominio.com
    ```

## Checklist de Despliegue

Antes de desplegar a producción, verifica:

- [ ] Todas las variables de entorno están configuradas
- [ ] La base de datos está respaldada
- [ ] Las migraciones se han ejecutado correctamente
- [ ] Los tests pasan
- [ ] El build se compila sin errores
- [ ] Los logs están configurados correctamente
- [ ] El SSL/HTTPS está habilitado
- [ ] El dominio está configurado correctamente
- [ ] Los backups automáticos están configurados
- [ ] El monitoreo está configurado
- [ ] El plan de recuperación ante desastres está en lugar

## Monitoreo en Producción

### Logs

```bash
# Ver logs en tiempo real
tail -f /var/log/ksol/app.log

# Buscar errores
grep ERROR /var/log/ksol/app.log
```

### Métricas

Configura herramientas de monitoreo:

- **Sentry:** Para tracking de errores
- **DataDog:** Para monitoreo de rendimiento
- **New Relic:** Para APM
- **Prometheus:** Para métricas personalizadas

### Backups

```bash
# Backup diario de base de datos
0 2 * * * pg_dump -U ksol_user ksol > /backups/ksol-$(date +\%Y\%m\%d).sql
```

## Escalabilidad

### Horizontal

1. **Múltiples instancias de aplicación**
   - Usar load balancer (Nginx, HAProxy)
   - Sesiones sin estado

2. **Caché distribuido**
   - Redis para sesiones
   - Redis para caché de datos

### Vertical

1. **Optimizar base de datos**
   - Índices adicionales
   - Particionamiento
   - Replicación

2. **Optimizar aplicación**
   - Code splitting
   - Lazy loading
   - Compresión

## Troubleshooting

### Aplicación no inicia

```bash
# Ver logs
pm2 logs ksol

# Verificar puerto
lsof -i :3000

# Reiniciar
pm2 restart ksol
```

### Base de datos no conecta

```bash
# Verificar conexión
psql -U ksol_user -d ksol -h localhost

# Ver estado de PostgreSQL
systemctl status postgresql
```

### Memoria insuficiente

```bash
# Ver uso de memoria
free -h

# Aumentar swap
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

---

**Última actualización:** Noviembre 2025
