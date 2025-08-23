import React from "react";

export function Avatar({ children }) {
  return <div className="rounded-full overflow-hidden w-12 h-12">{children}</div>;
}

export function AvatarImage({ src, alt }) {
  return <img src={src} alt={alt} className="w-full h-full object-cover" />;
}

export function AvatarFallback({ children }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
      {children}
    </div>
  );
}
