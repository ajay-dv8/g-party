"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "./button";

interface ModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  onOpenChange?: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ 
  children, 
  onOpenChange 
}: { 
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [open, setOpen] = useState(false);
  
  // Create a wrapped setOpen function that also calls onOpenChange
  const setOpenWithCallback = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <ModalContext.Provider value={{ open, setOpen: setOpenWithCallback, onOpenChange }}>
      {children} 
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export function Modal({ 
  children, 
  onOpenChange,
}: { 
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
}) {
  return <ModalProvider onOpenChange={onOpenChange}>{children}</ModalProvider>;
}

export const ModalTrigger = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { setOpen } = useModal();
  return (
    <Button
      className={cn(
        "px-4 text-center relative overflow-hidden rounded-full ",
        className
      )}
      variant={"ghost"}
      onClick={() => setOpen(true)}
    >
      {children}
    </Button>
  );
};

export const ModalBody = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { open, setOpen } = useModal();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const modalRef = useRef<HTMLDivElement>(null);
  useOutsideClick(modalRef, () => setOpen(false));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1, 
          }}
          exit={{
            opacity: 0, 
          }}
          className="fixed [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full  flex items-center justify-center z-50"
        >
          <Overlay />

          <motion.div
            ref={modalRef}
            className={cn(
              "min-h-[50%] max-h-[90%] md:max-w-[50%] bg-white dark:bg-neutral-950 border border-transparent dark:border-neutral-800 md:rounded-2xl z-50 flex flex-col flex-1 overflow-x-hidden sticky top-4",
              className
            )}
            initial={{
              opacity: 0,
              scale: 0.5, 
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1, 
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8, 
            }}
            transition={{
              type: "tween",
              stiffness: 260,
              damping: 15,
            }}
          >
            {children}
            <CloseIcon />
             
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ModalContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col flex-1 px-4 md:px-5", className)}>
      {children}
    </div>
  );
};

export const ModalFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex justify-end p-4 ",
        className
      )}
    >
      {children}
    </div>
  );
};

const Overlay = ({ className }: { className?: string }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1, 
      }}
      exit={{
        opacity: 0, 
      }}
      className={`fixed inset-0 h-full w-full bg-black bg-opacity-50 z-50 ${className}`}
    ></motion.div>
  );
};

const CloseIcon = () => {
  const { setOpen } = useModal();
  return (
    <button
      onClick={() => setOpen(false)}
      className="absolute top-4 right-4 group"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-black dark:text-white h-6 w-6 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
};

// Hook to detect clicks outside of a component.
export const useOutsideClick = (
    ref: React.RefObject<HTMLElement | null>,
    callback: (event: MouseEvent | TouchEvent) => void
  ) => {
    useEffect(() => {
      const listener = (event: MouseEvent | TouchEvent) => {
        if (!ref.current || !(event.target instanceof Node)) {
          return;
        }
        
        if (ref.current.contains(event.target)) {
          return;
        }
        
        callback(event);
      };
  
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
  
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [ref, callback]);
  };















// "use client";
// import { cn } from "@/lib/utils";
// import { AnimatePresence, motion } from "framer-motion";
// import React, {
//   ReactNode,
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { Button } from "./button";

// interface ModalContextType {
//   open: boolean;
//   setOpen: (open: boolean) => void;
// }

// const ModalContext = createContext<ModalContextType | undefined>(undefined);

// export const ModalProvider = ({ children }: { children: ReactNode }) => {
//   const [open, setOpen] = useState(false);

//   return (
//     <ModalContext.Provider value={{ open, setOpen }}>
//       {children} 
//     </ModalContext.Provider>
//   );
// };


// export const useModal = () => {
//   const context = useContext(ModalContext);
//   if (!context) {
//     throw new Error("useModal must be used within a ModalProvider");
//   }
//   return context;
// };

// export function Modal({ 
//   children, 
//   onOpenChange,
// }: { 
//   children: ReactNode 
//   onOpenChange?: (open: boolean) => void
// }) {
//   return <ModalProvider>{children}</ModalProvider>;
// }

// export const ModalTrigger = ({
//   children,
//   className,
// }: {
//   children: ReactNode;
//   className?: string;
// }) => {
//   const { setOpen } = useModal();
//   return (
//     <Button
//       className={cn(
//         "px-4 text-center relative overflow-hidden rounded-full ",
//         className
//       )}
//       variant={"ghost"}
//       onClick={() => setOpen(true)}
//     >
//       {children}
//     </Button>
//   );
// };

// export const ModalBody = ({
//   children,
//   className,
// }: {
//   children: ReactNode;
//   className?: string;
// }) => {
//   const { open } = useModal();

//   useEffect(() => {
//     if (open) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//   }, [open]);

//   const modalRef = useRef<HTMLDivElement>(null);
//   const { setOpen } = useModal();
//   useOutsideClick(modalRef, () => setOpen(false));

//   return (
//     <AnimatePresence>
//       {open && (
//         <motion.div
//           initial={{
//             opacity: 0,
//           }}
//           animate={{
//             opacity: 1, 
//           }}
//           exit={{
//             opacity: 0, 
//           }}
//           className="fixed [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full  flex items-center justify-center z-50"
//         >
//           <Overlay />

//           <motion.div
//             ref={modalRef}
//             className={cn(
//               "min-h-[50%] max-h-[90%] md:max-w-[50%] bg-white dark:bg-neutral-950 border border-transparent dark:border-neutral-800 md:rounded-2xl z-50 flex flex-col flex-1 overflow-x-hidden sticky top-4",
//               className
//             )}
//             initial={{
//               opacity: 0,
//               scale: 0.5, 
//               y: 40,
//             }}
//             animate={{
//               opacity: 1,
//               scale: 1, 
//               y: 0,
//             }}
//             exit={{
//               opacity: 0,
//               scale: 0.8, 
//             }}
//             transition={{
//               type: "tween",
//               stiffness: 260,
//               damping: 15,
//             }}
//           >
//             {children}
//             <CloseIcon />
             
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export const ModalContent = ({
//   children,
//   className,
// }: {
//   children: ReactNode;
//   className?: string;
// }) => {
//   return (
//     <div className={cn("flex flex-col flex-1 px-4 md:px-5", className)}>
//       {children}
//     </div>
//   );
// };

// export const ModalFooter = ({
//   children,
//   className,
// }: {
//   children: ReactNode;
//   className?: string;
// }) => {
//   return (
//     <div
//       className={cn(
//         "flex justify-end p-4 ",
//         className
//       )}
//     >
//       {children}
//     </div>
//   );
// };

// const Overlay = ({ className }: { className?: string }) => {
//   return (
//     <motion.div
//       initial={{
//         opacity: 0,
//       }}
//       animate={{
//         opacity: 1, 
//       }}
//       exit={{
//         opacity: 0, 
//       }}
//       className={`fixed inset-0 h-full w-full bg-black bg-opacity-50 z-50 ${className}`}
//     ></motion.div>
//   );
// };

// const CloseIcon = () => {
//   const { setOpen } = useModal();
//   return (
//     <button
//       onClick={() => setOpen(false)}
//       className="absolute top-4 right-4 group"
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="30"
//         height="30"
//         viewBox="0 0 30 30"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         className="text-black dark:text-white h-6 w-6 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
//       >
//         <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//         <path d="M18 6l-12 12" />
//         <path d="M6 6l12 12" />
//       </svg>
//     </button>
//   );
// };

// // Hook to detect clicks outside of a component.
// // Add it in a separate file, I've added here for simplicity
// // The rest of the code remains the same until the useOutsideClick hook

// export const useOutsideClick = (
//     ref: React.RefObject<HTMLElement | null>,
//     callback: (event: MouseEvent | TouchEvent) => void
//   ) => {
//     useEffect(() => {
//       const listener = (event: MouseEvent | TouchEvent) => {
//         if (!ref.current || !(event.target instanceof Node)) {
//           return;
//         }
        
//         if (ref.current.contains(event.target)) {
//           return;
//         }
        
//         callback(event);
//       };
  
//       document.addEventListener("mousedown", listener);
//       document.addEventListener("touchstart", listener);
  
//       return () => {
//         document.removeEventListener("mousedown", listener);
//         document.removeEventListener("touchstart", listener);
//       };
//     }, [ref, callback]);
//   };
 