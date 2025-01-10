"use client";

import { Button } from "@nextui-org/button";
import React from "react";

function OAuthButton({ children, logo, onClick }: { children: React.ReactNode, logo?: React.ReactNode, onClick?: React.MouseEventHandler<HTMLButtonElement> }) {
  return (
    <Button type="submit" onClick={onClick} radius="full" className="w-full text-base font-bold" color="secondary">
      {logo}
      <span>
        {children}
      </span>
    </Button>
  )
}

export default OAuthButton;
