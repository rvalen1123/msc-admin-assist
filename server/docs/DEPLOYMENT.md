# Deployment Guide

## Prerequisites

- Node.js 18.x or later
- PostgreSQL 14.x or later
- Redis 6.x or later
- AWS account (for S3 storage)
- SendGrid account (for email)

## Environment Setup

1. Create a new environment file:
   ```bash
   cp .env.example .env.production
   ```

2. Configure the following environment variables:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@host:5432/dbname

   # JWT
   JWT_SECRET=your-secret-key
   JWT_EXPIRATION=24h

   # AWS
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=your-region
   AWS_S3_BUCKET=your-bucket-name

   # SendGrid
   SENDGRID_API_KEY=your-api-key

   # Redis
   REDIS_URL=redis://host:6379

   # Application
   NODE_ENV=production
   PORT=3000
   ```

## Database Setup

1. Create the database:
   ```bash
   createdb dbname
   ```

2. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

3. Seed the database (if needed):
   ```bash
   npx prisma db seed
   ```

## Build and Deploy

1. Install dependencies:
   ```bash
   npm ci
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Start the application:
   ```bash
   npm run start:prod
   ```

## Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t msc-admin-assist .
   ```

2. Run the container:
   ```bash
   docker run -d \
     --name msc-admin-assist \
     -p 3000:3000 \
     --env-file .env.production \
     msc-admin-assist
   ```

## Kubernetes Deployment

1. Create a namespace:
   ```bash
   kubectl create namespace msc-admin
   ```

2. Apply secrets:
   ```bash
   kubectl create secret generic msc-admin-secrets \
     --from-file=.env.production \
     -n msc-admin
   ```

3. Deploy the application:
   ```bash
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```

## Monitoring Setup

1. Install Prometheus:
   ```bash
   helm install prometheus prometheus-community/prometheus
   ```

2. Install Grafana:
   ```bash
   helm install grafana grafana/grafana
   ```

3. Configure monitoring:
   - Set up Prometheus data sources in Grafana
   - Import dashboard templates
   - Configure alerts

## Backup and Recovery

### Database Backups

1. Manual backup:
   ```bash
   npm run db:backup
   ```

2. Restore from backup:
   ```bash
   pg_restore -d dbname backup-file.sql
   ```

### Application Backup

1. Backup configuration:
   ```bash
   cp .env.production .env.production.backup
   ```

2. Backup database:
   ```bash
   pg_dump dbname > db-backup.sql
   ```

## Scaling

### Horizontal Scaling

1. Update deployment:
   ```bash
   kubectl scale deployment msc-admin-assist --replicas=3
   ```

2. Configure load balancer:
   ```bash
   kubectl apply -f k8s/ingress.yaml
   ```

### Vertical Scaling

1. Update resource limits:
   ```bash
   kubectl patch deployment msc-admin-assist \
     -p '{"spec":{"template":{"spec":{"containers":[{"name":"msc-admin-assist","resources":{"limits":{"cpu":"1000m","memory":"1Gi"}}}]}}}}}'
   ```

## Maintenance

### Regular Tasks

1. Update dependencies:
   ```bash
   npm update
   ```

2. Check logs:
   ```bash
   kubectl logs -f deployment/msc-admin-assist
   ```

3. Monitor resources:
   ```bash
   kubectl top pods
   ```

### Troubleshooting

1. Check application logs:
   ```bash
   kubectl logs -f deployment/msc-admin-assist
   ```

2. Check database status:
   ```bash
   kubectl exec -it deployment/msc-admin-assist -- psql -U postgres
   ```

3. Check Redis status:
   ```bash
   kubectl exec -it deployment/msc-admin-assist -- redis-cli ping
   ```

## Rollback Procedures

1. Rollback deployment:
   ```bash
   kubectl rollout undo deployment/msc-admin-assist
   ```

2. Restore database:
   ```bash
   pg_restore -d dbname backup-file.sql
   ```

3. Restore configuration:
   ```bash
   cp .env.production.backup .env.production
   ```

## Security Considerations

1. SSL/TLS:
   - Configure SSL certificates
   - Enable HTTPS
   - Set up secure headers

2. Network Security:
   - Configure firewall rules
   - Set up VPN access
   - Implement rate limiting

3. Access Control:
   - Use RBAC in Kubernetes
   - Implement IP whitelisting
   - Set up audit logging

## Performance Optimization

1. Database:
   - Monitor query performance
   - Add missing indexes
   - Optimize slow queries

2. Application:
   - Enable caching
   - Configure compression
   - Optimize static assets

3. Infrastructure:
   - Use CDN for static content
   - Configure auto-scaling
   - Monitor resource usage 