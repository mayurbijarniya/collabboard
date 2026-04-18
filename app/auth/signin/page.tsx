"use client";

import Link from "next/link";
import Image from "next/image";
import { type FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { isValidEmail } from "@/lib/utils";

const OTP_LENGTH = 6;

const oauthProviders = [
  {
    id: "google",
    name: "Google",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="100"
        height="100"
        viewBox="0 0 48 48"
      >
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        ></path>
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        ></path>
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
      </svg>
    ),
  },
  {
    id: "github",
    name: "GitHub",
    icon: (
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

type OtpRequestResponse = {
  error?: string;
  expiresAt?: string;
  resendAvailableAt?: string;
};

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();

  const invitationEmail = searchParams.get("email");
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const isInvitationFlow = Boolean(invitationEmail);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [resendAvailableAt, setResendAvailableAt] = useState<string | null>(null);
  const [codeExpiresAt, setCodeExpiresAt] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const getRedirectPath = useCallback(() => {
    if (!callbackUrl) return "/dashboard";
    if (callbackUrl.startsWith("/")) return callbackUrl;

    try {
      const parsedUrl = new URL(callbackUrl);
      if (parsedUrl.origin === window.location.origin) {
        return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
      }
    } catch {
      return "/dashboard";
    }

    return "/dashboard";
  }, [callbackUrl]);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(getRedirectPath());
    }
  }, [getRedirectPath, router, status]);

  useEffect(() => {
    if (invitationEmail) {
      setEmail(invitationEmail);
    }
  }, [invitationEmail]);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      router.replace(`/auth/error?error=${errorParam}`);
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (!email || step !== "email") return;

    const timeoutId = setTimeout(() => {
      if (!isValidEmail(email)) {
        setEmailError("Please enter a valid email address");
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [email, step]);

  useEffect(() => {
    if (step !== "code" || !resendAvailableAt) return;

    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [resendAvailableAt, step]);

  const resendSecondsRemaining = useMemo(() => {
    if (!resendAvailableAt) return 0;
    return Math.max(0, Math.ceil((new Date(resendAvailableAt).getTime() - currentTime) / 1000));
  }, [currentTime, resendAvailableAt]);

  const codeExpiresInMinutes = useMemo(() => {
    if (!codeExpiresAt) return null;

    const minutesRemaining = Math.max(
      1,
      Math.ceil((new Date(codeExpiresAt).getTime() - currentTime) / (60 * 1000))
    );

    return minutesRemaining;
  }, [codeExpiresAt, currentTime]);

  const formattedCode = useMemo(() => {
    if (!code) return "";
    if (code.length <= 3) return code;
    return `${code.slice(0, 3)}-${code.slice(3)}`;
  }, [code]);

  const requestCode = useCallback(
    async (isResend = false) => {
      if (!isValidEmail(email)) {
        setEmailError(email ? "Please enter a valid email address" : "Email address is required");
        return;
      }

      setEmailError("");
      setCodeError("");
      setStatusMessage("");
      setIsSendingCode(true);

      try {
        const response = await fetch("/api/auth/otp/request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            callbackUrl,
          }),
        });

        const payload = (await response.json().catch(() => null)) as OtpRequestResponse | null;

        if (!response.ok) {
          if (payload?.resendAvailableAt) {
            setResendAvailableAt(payload.resendAvailableAt);
            setCurrentTime(Date.now());
          }

          setEmailError(payload?.error || "We couldn't send a sign-in code. Please try again.");
          return;
        }

        setStep("code");
        setCode("");
        setResendAvailableAt(payload?.resendAvailableAt || null);
        setCodeExpiresAt(payload?.expiresAt || null);
        setCurrentTime(Date.now());
        setStatusMessage(
          isResend ? "New code sent. Check your inbox." : "Code sent. Check your inbox."
        );
      } catch (error) {
        console.error("OTP request failed:", error);
        setEmailError("We couldn't send a sign-in code. Please try again.");
      } finally {
        setIsSendingCode(false);
      }
    },
    [callbackUrl, email]
  );

  const handleEmailSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await requestCode(false);
    },
    [requestCode]
  );

  const handleCodeSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (code.length !== OTP_LENGTH) {
        setCodeError(`Enter the ${OTP_LENGTH}-digit code from your email`);
        return;
      }

      setCodeError("");
      setEmailError("");
      setStatusMessage("");
      setIsVerifyingCode(true);

      try {
        const response = await fetch("/api/auth/otp/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            code,
            callbackUrl,
          }),
        });

        const payload = (await response.json().catch(() => null)) as
          | { error?: string; redirectTo?: string }
          | null;

        if (!response.ok || !payload?.redirectTo) {
          setCodeError(payload?.error || "We couldn't verify that code. Please try again.");
          return;
        }

        setStatusMessage("Sign-in successful. Redirecting...");
        window.location.assign(payload.redirectTo);
      } catch (error) {
        console.error("OTP verification failed:", error);
        setCodeError("We couldn't verify that code. Please try again.");
      } finally {
        setIsVerifyingCode(false);
      }
    },
    [callbackUrl, code, email]
  );

  const handleCodeChange = useCallback((value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, OTP_LENGTH);
    setCode(digitsOnly);
    if (codeError) setCodeError("");
  }, [codeError]);

  const handleEmailChange = useCallback(
    (value: string) => {
      setEmail(value);
      if (emailError) setEmailError("");
    },
    [emailError]
  );

  const handleResetToEmailStep = useCallback(() => {
    setStep("email");
    setCode("");
    setCodeError("");
    setStatusMessage("");
    setCodeExpiresAt(null);
    setResendAvailableAt(null);
  }, []);

  if (status === "loading" || status === "authenticated") {
    return <LoadingFallback />;
  }

  const isBusy = isSendingCode || isVerifyingCode;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900 p-4 sm:p-6">
      <Card className="w-full bg-white max-w-sm sm:max-w-md dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="text-center">
          <div className="flex justify-start mb-2">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to home
            </Link>
          </div>
          <Link href="https://collabboard.mayur.app" passHref>
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mb-4 ring-1 ring-blue-200/60 dark:ring-blue-800/40">
              <Image src="/logo/collabboard.svg" alt="CollabBoard Logo" width={48} height={48} />
            </div>
          </Link>
          <CardTitle className="text-xl sm:text-2xl font-bold text-foreground dark:text-zinc-100 flex items-center gap-2 justify-center">
            {step === "code" ? "Enter your sign-in code" : "Welcome to CollabBoard"}
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-zinc-400">
            {step === "code"
              ? "Use the 6-digit code we just emailed you."
              : isInvitationFlow
                ? "We'll email you a 6-digit code to verify your email address."
                : "Enter your email address and we'll send you a 6-digit sign-in code."}
          </CardDescription>
        </CardHeader>

        <form onSubmit={step === "email" ? handleEmailSubmit : handleCodeSubmit}>
          <CardContent className="space-y-4">
            {isInvitationFlow && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  You&apos;re signing in from an organization invitation.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground dark:text-zinc-200">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => handleEmailChange(event.target.value)}
                disabled={isBusy || step === "code" || isInvitationFlow}
                required
                autoComplete="email"
                inputMode="email"
                className={`h-12 bg-white border-gray-300 text-foreground placeholder:text-gray-400 hover:border-gray-400 transition-colors ${
                  emailError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {emailError && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{emailError}</p>
              )}
            </div>

            {step === "code" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-foreground dark:text-zinc-200">
                    Verification code
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="XXX-XXX"
                    value={formattedCode}
                    onChange={(event) => handleCodeChange(event.target.value)}
                    disabled={isBusy}
                    required
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    maxLength={OTP_LENGTH + 1}
                    className={`h-12 text-center text-lg font-medium bg-white border-gray-300 text-foreground placeholder:text-gray-400 hover:border-gray-400 transition-colors ${
                      codeError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  {codeError && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{codeError}</p>
                  )}
                </div>

                <div className="rounded-md border border-gray-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50 px-3 py-3 text-sm text-muted-foreground dark:text-zinc-400 space-y-1">
                  <p>
                    {statusMessage
                      ? statusMessage
                      : codeExpiresInMinutes
                        ? `Code expires in about ${codeExpiresInMinutes} minute(s).`
                        : "Enter the code from your email."}
                  </p>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col">
            <Button
              type="submit"
              className="w-full h-12 font-medium mt-4 bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-zinc-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900"
              disabled={
                isBusy ||
                !email ||
                !!emailError ||
                (step === "code" && code.length !== OTP_LENGTH)
              }
              aria-busy={isBusy}
            >
              {isSendingCode ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending code...
                </>
              ) : isVerifyingCode ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying code...
                </>
              ) : (
                <>
                  {step === "code" ? "Verify and continue" : "Continue with Email"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            {step === "code" && (
              <div className="flex w-full gap-3 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-white border-gray-200 text-gray-900 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-95"
                  onClick={() => requestCode(true)}
                  disabled={isBusy || resendSecondsRemaining > 0}
                >
                  {resendSecondsRemaining > 0 ? `Resend in ${resendSecondsRemaining}s` : "Resend code"}
                </Button>
                {!isInvitationFlow && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-white border-gray-200 text-gray-900 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-95"
                    onClick={handleResetToEmailStep}
                    disabled={isBusy}
                  >
                    Change email
                  </Button>
                )}
              </div>
            )}

            <div className="relative mt-6 w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-zinc-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-muted-foreground dark:bg-zinc-900 dark:text-zinc-400">
                  or continue with
                </span>
              </div>
            </div>

            <div className="space-y-3 w-full mt-4">
              {oauthProviders.map((provider) => (
                <Button
                  key={provider.id}
                  type="button"
                  variant="outline"
                  className="w-full h-12 justify-center bg-white border-gray-200 text-gray-900 active:scale-[0.98] dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 cursor-pointer dark:hover:bg-zinc-900 transition-all"
                  onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                >
                  {provider.icon}
                  Continue with {provider.name}
                </Button>
              ))}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900 p-4 sm:p-6">
      <Card className="w-full max-w-sm sm:max-w-md bg-white/95 dark:bg-zinc-900/95 border border-gray-200 dark:border-zinc-800 shadow-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4 dark:bg-zinc-800">
            <div className="w-6 h-6 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground dark:border-zinc-700 dark:border-t-zinc-100" />
          </div>
          <CardTitle className="text-xl sm:text-2xl text-foreground dark:text-zinc-100">
            Loading...
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-zinc-400">
            Please wait while we prepare the sign in page
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SignInContent />
    </Suspense>
  );
}
