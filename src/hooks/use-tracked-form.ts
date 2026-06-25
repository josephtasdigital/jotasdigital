import { useCallback, useRef, useState } from "react";
import {
  submitTrackedForm,
  type FormConfig,
  type SubmitParams,
  type SubmitResult,
} from "@/lib/forms/submitForm";

export interface UseTrackedFormSubmission {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  lastEventId: string | null;
  submitForm: (
    args: Omit<SubmitParams, "config">,
  ) => Promise<SubmitResult>;
  reset: () => void;
}

/**
 * Single source of truth for form submission UX state + tracking.
 * Pair it with one FormConfig per form instance.
 */
export function useTrackedFormSubmission(config: FormConfig): UseTrackedFormSubmission {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastEventId, setLastEventId] = useState<string | null>(null);
  const lockRef = useRef(false);

  const submitForm = useCallback<UseTrackedFormSubmission["submitForm"]>(
    async (args) => {
      if (lockRef.current || isSuccess) {
        return { ok: false, event_id: "", error: "locked" };
      }
      lockRef.current = true;
      setIsSubmitting(true);
      setError(null);

      const result = await submitTrackedForm({ config, ...args });
      setLastEventId(result.event_id);

      if (result.ok) {
        setIsSuccess(true);
      } else if (result.error && result.error !== "submission_in_flight") {
        setError(result.error);
      }

      setIsSubmitting(false);
      lockRef.current = false;
      return result;
    },
    [config, isSuccess],
  );

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setIsSuccess(false);
    setError(null);
    setLastEventId(null);
    lockRef.current = false;
  }, []);

  return { isSubmitting, isSuccess, error, lastEventId, submitForm, reset };
}
