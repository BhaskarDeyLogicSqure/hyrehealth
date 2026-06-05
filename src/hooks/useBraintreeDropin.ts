import { useEffect, useRef, useState } from "react";

type DropinInstance = {
  requestPaymentMethod: (options?: any) => Promise<any>;
  teardown: () => Promise<void>;
};

export function useBraintreeDropin({
  clientToken,
  threeDSecure = true,
}: {
  clientToken: string;
  threeDSecure?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<DropinInstance | null>(null);
  const isInitializingRef = useRef(false);
  const initRunIdRef = useRef(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const runId = ++initRunIdRef.current;

    const init = async () => {
      if (!containerRef.current) return;

      // Prevent duplicate init (Strict Mode safe)
      if (isInitializingRef.current || instanceRef.current) return;

      isInitializingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        // Ensure clean container
        containerRef.current.replaceChildren();

        const mod: any = await import("braintree-web-drop-in");
        const dropin = mod?.default ?? mod;

        const instance: DropinInstance = await dropin.create({
          authorization: clientToken,
          container: containerRef.current,
          threeDSecure,
        });

        if (cancelled || runId !== initRunIdRef.current) {
          await instance.teardown();
          return;
        }

        instanceRef.current = instance;
      } catch (e: any) {
        // Ignore duplicate container error (React 18 quirk)
        if (e?.message?.includes("must reference an empty DOM node")) {
          // eslint-disable-next-line no-console
          console.warn("Ignored duplicate drop-in initialization");
        } else {
          setError(e?.message || "Failed to initialize payment UI");
        }
      } finally {
        isInitializingRef.current = false;
        if (!cancelled) setIsLoading(false);
      }
    };

    void init();

    return () => {
      cancelled = true;
      isInitializingRef.current = false;

      const instance = instanceRef.current;
      instanceRef.current = null;

      if (instance) {
        void instance.teardown().catch(() => {});
      }

      // Clean DOM
      if (containerRef.current) {
        containerRef.current.replaceChildren();
      }
    };
  }, [clientToken, threeDSecure]);

  return {
    containerRef,
    instance: instanceRef,
    isLoading,
    error,
  };
}

