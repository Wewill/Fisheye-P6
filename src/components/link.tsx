// @src/components/Link.jsx
import React from 'react';

type Props = {
    to: string;
    params?: object;
    children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const toWithParams = (to = '', params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    console.log('Link::', params, queryString);
    return queryString ? `${to}?${queryString}` : to;
};

const Link = ({ to = '', params = {}, children, ...props }: Props) => {
    const preventReload = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        window.history.pushState({}, '', toWithParams(to, params)); // https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
        const navigationEvent = new PopStateEvent('navigate');
        window.dispatchEvent(navigationEvent);
    };
    return (
        <a href={toWithParams(to, params)} onClick={preventReload} {...props}>
            {children}
        </a>
    );
};

export default Link;
