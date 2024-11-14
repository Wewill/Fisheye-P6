// @src/components/Link.jsx
import React from "react";

const Link = ({ to = "", params = {}, children, ...props}) => {
  const preventReload = (event) => {
    event.preventDefault();
    window.history.pushState({}, "", to); // https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
    const navigationEvent = new PopStateEvent("navigate");
    window.dispatchEvent(navigationEvent);
  };
  const queryString = new URLSearchParams(params).toString();
  const toWithParams = queryString ? `${to}?${queryString}` : to;
  return (
    <a href={toWithParams} onClick={preventReload} {...props}>
      {children}
    </a>
  );
};

export default Link;
