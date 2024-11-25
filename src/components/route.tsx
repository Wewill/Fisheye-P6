// @src/components/Route.jsx
import * as React from "react";
import BrowserRouterContext from "../router/context";

type Props = {
  path: string;
  children: React.ReactNode;
  className?: string | undefined;
};

const Route = ({ path, children, className }: Props) => {
  const context = React.useContext(BrowserRouterContext);
  if (context.currentPath !== path) return null;
  return <div className={className}>{children}</div>;
};

export default Route;
