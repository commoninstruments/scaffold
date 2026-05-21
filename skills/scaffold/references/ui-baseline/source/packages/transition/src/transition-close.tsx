"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

const TransitionClose = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof Dialog.Close>
>((props, ref) => {
  return <Dialog.Close data-slot="transition-close" ref={ref} {...props} />;
});

TransitionClose.displayName = "TransitionClose";

export { TransitionClose };
