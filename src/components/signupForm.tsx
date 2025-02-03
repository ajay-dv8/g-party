"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import * as RPNInput from "react-phone-number-input";
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PasswordInput from '@/components/ui/password-input';
import PhoneNumberInput from '@/components/ui/phone-input';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define form schema using Zod for validation
const signUpSchema = z.object({
  full_name: z.string().min(3, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3, "Username is required"),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, "Invalid phone number format"),
  gender: z.string().min(1, "Gender is required"),
});

// Define TypeScript interface for form inputs
interface SignUpFormInputs extends z.infer<typeof signUpSchema> { }

export const SignUpForm = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;
  const router = useRouter();

  // Initialize react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    clearErrors,
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
  });


  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    console.log('Form submitted!'); // Confirm onSubmit is triggered
    try {
      const formattedData = {
        ...data,
        // dateOfBirth: data.dateOfBirth.toISOString(), // Convert date to ISO string
      };

      // console.log('Formatted Data:', formattedData); // Debugging log(shows signup details)

      const response = await axios.post('/api/signup', formattedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.data || !response.status.toString().startsWith('2')) {
        throw new Error('Signup failed');
      }

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Signup error:', error.message || error);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="w-full ~p-8/14">
      <div className="w-full my-10">
        <h1 className="text-4xl font-semibold">Get Started</h1>
        <h5 className="text-muted-foreground my-2">Create an account</h5>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-3 w-full">
        {currentPage === 1 ? (
          <>
            {/* Full Name Input */}
            <Label htmlFor="fullName">Full Name</Label>
            <Input type="text" id="fullName" placeholder="John Doe" {...register('full_name')} />
            {errors.full_name && <p className="text-sm text-red-500 mt-1">{errors.full_name.message}</p>}

            {/* Email Input */}
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="example@email.com" {...register('email')} />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}

            {/* Password Input */}
            <PasswordInput label="Password" placeholder="Password" {...register('password')} />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </>
        ) : (
          <>
            {/* Username Input */}
            <Label htmlFor="username">Username</Label>
            <Input type="text" id="username" placeholder="Username" autoComplete='off ' {...register('username')} />
            {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>}

            {/* Phone Number Input */}
            <Controller name="phone" control={control} render={({ field }) => (
              //   <PhoneNumberInput label="Phone Number" value={field.value} onChange={field.onChange} />
              <PhoneNumberInput
                label="Phone Number"
                value={field.value as RPNInput.Value}
                onChange={(value) => {
                  field.onChange(value); // Pass the E.164 formatted value
                  clearErrors("phone");
                }}
              />
            )} />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}

            {/* Gender Selection */}
            <Label htmlFor="gender">Gender</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    clearErrors("gender");
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel id='gender'>Gender</SelectLabel>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gender && <p className="text-sm text-red-500 mt-1">{errors.gender.message}</p>}
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          <Button type="button" variant="ghost" onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1}>
            <ArrowLeft size={16} strokeWidth={2} /> Previous
          </Button>
          {currentPage < totalPages ? (
            <Button type="button" variant="ghost" onClick={() => setCurrentPage((prev) => prev + 1)}>
              Next <ArrowRight size={16} strokeWidth={2} />
            </Button>
          ) : (
            <Button type="submit" >Submit</Button>
          )}
        </div>
      </form>
    </div>
  );
};
