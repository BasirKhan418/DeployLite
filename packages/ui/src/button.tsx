// "use client";
//
// import { ReactNode } from "react";
//
// interface ButtonProps {
//   children: ReactNode;
//   className?: string;
//   appName: string;
// }
//
// export const Button = ({ children, className, appName }: ButtonProps) => {
//   return (
//     <button
//       className={className}
//       onClick={() => alert(`Hello from your ${appName} app!`)}
//     >
//       {children}
//     </button>
//   );
// };

"use client";

import { ReactNode, isValidElement } from "react";

interface ButtonProps {
    children: ReactNode;
    className?: string;
    appName: string;
}

export const Button = ({ children, className, appName }: ButtonProps) => {
    // Handle non-renderable types (e.g., bigint, boolean, etc.)
    const renderChildren = () => {
        if (typeof children === "bigint") return children.toString();
        if (typeof children === "boolean" || children === undefined) return null;
        if (typeof children === "number") return children.toString();
        if (typeof children === "string" || isValidElement(children)) return children;
        if (Array.isArray(children)) return children.map((child, idx) => (
            <span key={idx}>{typeof child === "bigint" ? child.toString() : child}</span>
        ));
        return children;
    };

    return (
        <button
            className={className}
            onClick={() => alert(`Hello from your ${appName} app!`)}
        >
            {renderChildren()}
        </button>
    );
};
