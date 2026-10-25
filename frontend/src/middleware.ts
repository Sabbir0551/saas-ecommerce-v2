import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Extract clean hostname without port
  const hostWithoutPort = hostname.split(':')[0].toLowerCase();
  
  // Exclude static assets and API routes
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.') // static files like favicon.ico, images, etc.
  ) {
    return NextResponse.next();
  }

  let detectedTenant = url.searchParams.get('tenant') || '';

  // If tenant query param is not explicitly given, derive from subdomain or custom domain
  if (!detectedTenant) {
    const parts = hostWithoutPort.split('.');
    
    // Check if localhost subdomain (e.g. smartvolt.localhost)
    if (parts.length > 1 && parts[parts.length - 1] === 'localhost' && parts[0] !== 'localhost') {
      detectedTenant = parts[0];
    }
    // Check if live domain subdomain (e.g. smartvolt.nexstore.com or smartvolt.yourdomain.com)
    else if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'app' && parts[0] !== 'admin') {
      detectedTenant = parts[0];
    }
    // Custom domain mapping (e.g. smartvolt.com.bd or customstore.com)
    else if (
      parts.length >= 2 &&
      !hostWithoutPort.includes('localhost') &&
      !hostWithoutPort.includes('vercel.app') &&
      !hostWithoutPort.includes('nexstore.com')
    ) {
      detectedTenant = hostWithoutPort.replace(/\./g, '_');
    }
  }

  // Fallback to default demo tenant if not found
  if (!detectedTenant) {
    detectedTenant = 'smartvolt';
  }

  // Clone headers and inject tenant context
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-slug', detectedTenant);
  requestHeaders.set('x-tenant-host', hostWithoutPort);

  // If query parameter was missing, rewrite internally so all pages receive it
  if (!url.searchParams.get('tenant')) {
    url.searchParams.set('tenant', detectedTenant);
    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
