"use client";

import { cn } from "@/lib/utils";
import {
  DateFieldProps,
  DateField as DateFieldRac,
  DateInputProps as DateInputPropsRac,
  DateInput as DateInputRac,
  DateSegmentProps,
  DateSegment as DateSegmentRac,
  DateValue,
  DateValue as DateValueRac,
  TimeFieldProps,
  TimeField as TimeFieldRac,
  TimeValue as TimeValueRac,
  composeRenderProps,
} from "react-aria-components"; 

import { Calendar } from "@/components/ui/calendar-rac"; 
import { CalendarIcon } from "lucide-react";
import { Button, DatePicker, Dialog, Group, Popover } from "react-aria-components";


const DateField = <T extends DateValueRac>({
  className,
  children,
  ...props
}: DateFieldProps<T>) => {
  return (
    <DateFieldRac
      className={composeRenderProps(className, (className) => cn("space-y-2", className))}
      {...props}
    >
      {children}
    </DateFieldRac>
  );
};

const TimeField = <T extends TimeValueRac>({
  className,
  children,
  ...props
}: TimeFieldProps<T>) => {
  return (
    <TimeFieldRac
      className={composeRenderProps(className, (className) => cn("space-y-2", className))}
      {...props}
    >
      {children}
    </TimeFieldRac>
  );
};

const DateSegment = ({ className, ...props }: DateSegmentProps) => {
  return (
    <DateSegmentRac
      className={composeRenderProps(className, (className) =>
        cn(
          "inline rounded p-0.5 text-foreground caret-transparent outline outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-accent data-[invalid]:data-[focused]:bg-destructive data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-foreground data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 data-[disabled]:opacity-50",
          className,
        ),
      )}
      {...props}
    />
  );
};

const dateInputStyle =
  "relative inline-flex h-10 w-full items-center overflow-hidden whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2";

  

interface DateInputProps extends DateInputPropsRac {
  className?: string;
  unstyled?: boolean; 
}

const DateInput = ({ className, unstyled = false, ...props }: Omit<DateInputProps, "children">) => {
  return (
    <DateInputRac
      className={composeRenderProps(className, (className) =>
        cn(!unstyled && dateInputStyle, className),
      )} 
      {...props}
    >
      {(segment) => <DateSegment segment={segment} />}
    </DateInputRac>
  );
};

export { DateField, DateInput, DateSegment, TimeField, dateInputStyle };
export type { DateInputProps };




import { Control, Controller, FieldValues, Path } from "react-hook-form";


interface SelectDateProps {
  value?: DateValue;
  onChange?: (value: DateValue | string | null) => void;
  name?: string;
}

export default function SelectDate({ value, onChange, ...props }: SelectDateProps) {
  return (
    <DatePicker className="space-y-2" value={value} onChange={onChange} {...props}>
      <div className="flex">
        <div className="w-full">
          <input
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={value ? value.toString() : ''}
            onChange={(e) => onChange?.(e.target.value )}
          />
        </div>
        <Button className="z-10 -me-px -ms-9 flex w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-primary/70">
          <CalendarIcon size={16} strokeWidth={2} />
        </Button>
      </div>
      <Popover
        className="z-50 rounded-md border border-border bg-background text-popover-foreground shadow-lg outline-none data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2"
        offset={4}
      >
        <Dialog className="max-h-[inherit] overflow-auto p-2">
          <Calendar value={value} onChange={onChange} />
        </Dialog>
      </Popover>
    </DatePicker>
  );
}

// interface SelectDateProps {
//   value?: DateValue;
//   onChange?: (value: DateValue | null) => void;
//   name?: string;
//   min?: string | number;
//   max?: string | number;
//   disabled?: boolean;
// }

// export default function SelectDate({ value, onChange, ...props }: SelectDateProps) {
//   return (
//     <DatePicker value={value} onChange={onChange} className="space-y-2">
//       <div className="flex">
//         <Group className="w-full">
//           <DateInput  
//             className="pe-9" 
//             {...props}
//           />
//         </Group>
//         <Button className="z-10 -me-px -ms-9 flex w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-primary/70">
//           <CalendarIcon size={16} strokeWidth={2} />
//         </Button>
//       </div>
//       <Popover
//         className="z-50 rounded-md border border-border bg-background text-popover-foreground shadow-lg outline-none data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2"
//         offset={4}
//       >
//         <Dialog className="max-h-[inherit] overflow-auto p-2">
//           <Calendar />
//         </Dialog>
//       </Popover>
//     </DatePicker>
//   );
// }




// interface SelectDateProps {
//   value?: DateValue;
//   onChange?: (value: DateValue | null) => void;
//   name?: string;
//   min?: string | number;
//   max?: string | number;
//   disabled?: boolean;
// }

// interface SelectDateFormProps<T extends FieldValues> extends Omit<SelectDateProps, 'value' | 'onChange'> {
//   name: Path<T>;
//   control: Control<T>;
// }

// export default function SelectDate<T extends FieldValues>({ 
//   name,
//   control,
//   ...props
// }: SelectDateFormProps<T>) {
//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field }) => (
//         <DatePicker
//           value={field.value}
//           onChange={(date) => {
//             field.onChange(date);
//           }}
//         >
//           <div className="flex">
//             <Group className="w-full">
//               <DateInput 
//                 className="pe-9"
//                 {...props}
//               />
//             </Group>
//             <Button className="z-10 -me-px -ms-9 flex w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-primary/70">
//               <CalendarIcon size={16} strokeWidth={2} />
//             </Button>
//           </div>
//           <Popover
//             className="z-50 rounded-md border border-border bg-background text-popover-foreground shadow-lg outline-none data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2"
//             offset={4}
//           >
//             <Dialog className="max-h-[inherit] overflow-auto p-2">
//               <Calendar />
//             </Dialog>
//           </Popover>
//         </DatePicker>
//       )}
//     />
//   );
// }