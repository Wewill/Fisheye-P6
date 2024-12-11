import * as React from 'react';
import BrowserRouterContext from '../router/context';

type Props = {
    path: string;
    children: React.ReactNode;
    className?: string | undefined;
};

const Route = ({ path, children, className }: Props) => {
    const context = React.useContext(BrowserRouterContext);
    if (context.currentPath !== path) return null;
    return (
        <section className={className} aria-labelledby="section-title">
            {children}
        </section>
    );
};

export default Route;
