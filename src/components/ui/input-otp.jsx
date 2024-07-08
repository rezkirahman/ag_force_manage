"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Dot } from "lucide-react"
import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props} />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];
  const [displayValue, setDisplayValue] = React.useState(char);

  React.useEffect(() => {
    setDisplayValue(char);

    const timer = setTimeout(() => {
      if (char) {
        setDisplayValue('•');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [char]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-gray-500 text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md dark:border-gray-800",
        isActive && "z-10 ring-2 ring-gray-950 ring-offset-white dark:ring-gray-300 dark:ring-offset-gray-950",
        className
      )}
      {...props}>
      {displayValue}
      {hasFakeCaret && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-px h-4 duration-1000 animate-caret-blink bg-gray-950 dark:bg-gray-50" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
