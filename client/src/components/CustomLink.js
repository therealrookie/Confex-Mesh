import React from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

function CustomLink({ to, children, baseClassName = "nav-link", ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  // Apply baseClassName dynamically and append active or primary class based on isActive
  const className = `${baseClassName} ${isActive ? "text-secondary" : "text-primary"}`;

  return (
    <Link className={className} aria-current={isActive ? "page" : undefined} to={to} {...props}>
      {children}
    </Link>
  );
}

export default CustomLink;
