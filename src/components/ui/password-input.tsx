"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useId, useState, forwardRef } from "react";
import { InputHTMLAttributes } from "react";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  placeholder: string;
  forgotPasswordClassName?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ 
    label, 
    placeholder, 
    className, 
    forgotPasswordClassName, 
    ...props 
  }, 
    ref
  ) => {
    const id = useId();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const toggleVisibility = () => setIsVisible((prevState) => !prevState);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={id}>{label}</Label>
          <Link
            href="/forgot-password"
            className={cn(
              "text-muted-foreground text-xs text-end hover:underline ",
              forgotPasswordClassName
            )}
          >
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <Input
            {...props}
            id={id}
            ref={ref}
            className={cn("pe-9", className)}
            placeholder={placeholder}
            type={isVisible ? "text" : "password"}
          />
          <button
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            aria-controls="password"
          >
            {isVisible ? (
              <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Eye size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;









// "use client";

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { cn } from "@/lib/utils";
// import { Eye, EyeOff } from "lucide-react";
// import Link from "next/link";
// import { useId, useState } from "react";

// export default function PasswordInput({
//   placeholder,
//   label,
//   name, 
//   forgotPasswordClassName,
// }: {
//   label: string;
//   placeholder: string;
//   name: string; 
//   forgotPasswordClassName?: string;
// }) {
//   const id = useId();
//   const [isVisible, setIsVisible] = useState<boolean>(false);

//   const toggleVisibility = () => setIsVisible((prevState) => !prevState);

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between">
//         <Label htmlFor={id}>{label}</Label>
//         <Link
//           href="/forgot-password"
//           className={cn("text-muted-foreground text-sm text-end hover:underline", forgotPasswordClassName)}
//         >
//           Forgot Password?
//         </Link> 
//       </div> 
//       <div className="relative">
//         <Input
//           id={id}
//           name={name}
//           className="pe-9"
//           placeholder={placeholder}
//           type={isVisible ? "text" : "password"}
//         />
//         <button
//           className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
//           type="button"
//           onClick={toggleVisibility}
//           aria-label={isVisible ? "Hide password" : "Show password"}
//           aria-pressed={isVisible}
//           aria-controls="password"
//         >
//           {isVisible ? (
//             <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
//           ) : (
//             <Eye size={16} strokeWidth={2} aria-hidden="true" />
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }
