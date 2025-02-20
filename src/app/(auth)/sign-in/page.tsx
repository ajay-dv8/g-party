"use client";
import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link' 

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PasswordInput from '@/components/ui/password-input' 
import { useForm } from 'react-hook-form'; 
import { SignUpForm } from '@/components/signupForm'; 
import { supabase } from '@/utils/supabase/auth-client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const SignIn = () => {
  const searchParams = useSearchParams();
  const formType = searchParams.get('form') || 'sign-in'; // Default to 'sign-in'
 
  return (
    <div className='w-full h-screen flex'>
      <div className='hidden md:block w-3/5  bg-primary/10 '>
        <Link href="/" className="flex items-center gap-x-3 px-10 py-6">
          <Image src="/logo.svg" alt="logo" width={50} height={50} />
          <h1 className="text-2xl font-bold">Sendsom</h1>
        </Link>

        <div className="">
          image or quote
        </div>
      </div>

      <div className="w-full md:w-2/5 flex flex-col items-center justify-center">

        {formType === 'sign-in' ? <SignInForm /> : <SignUpForm />}

        <p className="text-xs text-muted-foreground text-center ~px-4/20 absolute ~bottom-3/6">
          By continuing, you agree to Sendsom's <Link href="/terms-of-service" className=" underline">Terms of Service</Link> and <Link href="/privacy-policy" className=" underline">Privacy Policy</Link>, and to receive periodic emails with updates.
        </p>
      </div>

    </div>
  )
}
export default SignIn



// SIGN IN FORM 

// Define sign inform schema using Zod for validation
const signInSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").min(1, "Password is required"),
});

// Define TypeScript interface for form inputs
interface SignInFormInputs extends z.infer<typeof signInSchema> {}

export const SignInForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>({
    resolver: zodResolver(signInSchema),
  });

  // Handle form submission
  const handleLogin = async (data: SignInFormInputs) => {
    const { email, password } = data;

    setIsLoading(true); // Set loading state
    setAuthError(null); // Clear any previous auth errors

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || "Failed to log in");
      }

      // Redirect to dashboard on successful login
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error logging in:", error.message);
      setAuthError(error.message || "An unknown error occurred");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="w-full ~p-8/20">
      <div className="w-full my-10">
        <h1 className="text-4xl font-semibold">Welcome back</h1>
        <h5 className="text-muted-foreground my-2">Sign in to your account</h5>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-y-4 w-full">
        {/* Email Input */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="example@email.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <PasswordInput
            label="Password"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
          )}
          <Link
            href="/forgot-password"
            className="text-primary text-xs text-end hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Auth Error Message */}
        {authError && (
          <p className="text-sm text-red-500 mt-2">{authError}</p>
        )}

        {/* Sign In Button */}
        <Button type="submit" disabled={isLoading} className="mt-2">
          {isLoading ? "Logging in..." : "Sign In"}
        </Button>
      </form>

      {/* Sign Up Link */}
      <p className="text-muted-foreground text-sm mt-4 text-center">
        Don't have an account?{" "}
        <Link
          href="/sign-in?form=sign-up"
          className="text-primary hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};