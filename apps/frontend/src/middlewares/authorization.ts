import { NextFetchEvent, NextResponse, type NextRequest } from 'next/server';
import { MiddlewareFactory } from './stackHandler';

export const authorization: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const { origin, pathname } = new URL(request.url);
    const pathsnames = [`sign-in`, `sign-up`];
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      if (request.nextUrl.pathname === '/dashboard') {
        return NextResponse.redirect(`${origin}/sign-in`);
      }
      return response;
    }

    if (
      pathsnames.some(
        (route: string) =>
          pathname.startsWith(`/${route}/`) || pathname === `/${route}`,
      )
    ) {
      if (pathname === `/sign-in` || pathname === `/sign-up/`) {
        //Wreturn NextResponse.redirect(`${origin}`);
      }
      return response;
    }

    return next(request, _next);
  };
};
