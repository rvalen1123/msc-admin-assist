import helmet from 'helmet';

export const securityConfig = helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'http://localhost:3000', 'https://api.example.com'],
    },
  } : false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: {
    policy: 'same-origin',
  },
  crossOriginResourcePolicy: {
    policy: 'same-site',
  },
  dnsPrefetchControl: {
    allow: true,
  },
  frameguard: {
    action: 'deny',
  },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: {
    permittedPolicies: 'none',
  },
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
  xssFilter: true,
}); 