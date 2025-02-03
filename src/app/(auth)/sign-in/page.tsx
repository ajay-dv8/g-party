"use client";
import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link' 

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PasswordInput from '@/components/ui/password-input' 
import { useForm, SubmitHandler } from 'react-hook-form'; 
import { SignUpForm } from '@/components/signupForm';
import { createClient } from '@/utils/supabase/client';

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

interface SignInFormInputs {
  email: string;
  password: string;
}
export const SignInForm = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>();

  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Error logging in:", error.message);
    } else {
      router.push("/dashboard");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full ~p-8/20">
      <div className="w-full my-10">
        <h1 className="text-4xl font-semibold ">Welcome back</h1>
        <h5 className="text-muted-foreground my-2">Sign in to your account</h5>
      </div>

      <form onSubmit={handleLogin} className=" flex flex-col gap-y-4 w-full">
        <div className="">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="example@email.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="w-full">
          {/* Password Input component with lable and forgot password link from components/ui/password-input */}
          <PasswordInput
            label="Password"
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
          )}

          <Link
            href="/forgot-password"
            className="text-primary text-sm text-end hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          className='mt-2'> Sign In
        </Button>
      </form>

      <p className="text-muted-foreground text-sm mt-2 text-center">
        Don't have an account? <Link href="/sign-in?form=sign-up" className="text-primary hover:underline">Sign Up</Link>
      </p>
    </div>
  )
}






