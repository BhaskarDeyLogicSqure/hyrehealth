"use client";

import { useState, useEffect, useCallback } from "react";

export function useCookies() {
  const [cookies, setCookies] = useState<Record<string, string>>({});

  useEffect(() => {
    const parseCookies = () => {
      const cookieString = document?.cookie;
      const cookieObject: Record<string, string> = {};

      if (cookieString) {
        cookieString?.split(";")?.forEach((cookie) => {
          const [name, ...rest] = cookie?.trim()?.split("=");
          const value = rest?.join("=");
          if (name && value !== undefined) {
            cookieObject[name] = decodeURIComponent(value);
          }
        });
      }
      return cookieObject;
    };

    setCookies(parseCookies());
  }, []);

  const getCookie = useCallback(
    (name: string): string | undefined => {
      return cookies[name];
    },
    [cookies]
  );

  const setCookie = useCallback(
    (
      name: string,
      value: string,
      options: {
        expires?: Date;
        maxAge?: number;
        domain?: string;
        path?: string;
        secure?: boolean;
        sameSite?: "Strict" | "Lax" | "None";
      } = {}
    ) => {
      let cookieString = `${name}=${encodeURIComponent(value)}`;

      if (options.expires) {
        cookieString += `; Expires=${options?.expires?.toUTCString()}`;
      }

      if (options.maxAge) {
        cookieString += `; Max-Age=${options?.maxAge}`;
      }

      if (options?.domain) {
        cookieString += `; Domain=${options?.domain}`;
      }

      cookieString += `; Path=${options?.path || "/"}`;

      if (options?.secure) {
        cookieString += `; Secure`;
      }

      if (options?.sameSite) {
        cookieString += `; SameSite=${options?.sameSite}`;
      }

      document.cookie = cookieString;

      setCookies((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const removeCookie = useCallback(
    (
      name: string,
      options: {
        domain?: string;
        path?: string;
      } = {}
    ) => {
      let cookieString = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;

      if (options?.domain) {
        cookieString += `; Domain=${options?.domain}`;
      }

      cookieString += `; Path=${options?.path || "/"}`;

      document.cookie = cookieString;

      setCookies((prev) => {
        const newCookies = { ...prev };
        delete newCookies[name];
        return newCookies;
      });
    },
    []
  );

  const hasCookie = useCallback(
    (name: string): boolean => {
      return cookies.hasOwnProperty(name) && cookies[name] !== "";
    },
    [cookies]
  );

  return {
    cookies,
    getCookie,
    setCookie,
    removeCookie,
    hasCookie,
  };
}
