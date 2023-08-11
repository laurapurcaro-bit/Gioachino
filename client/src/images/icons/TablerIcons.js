import React from "react";

export const ChevronUp = ({ thick }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-chevron-up"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth={thick ? "2" : "1.5"}
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M6 15l6 -6l6 6"></path>
  </svg>
);

export const ChevronDown = ({ thick }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-chevron-down"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth={thick ? "2" : "1.5"}
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M6 9l6 6l6 -6"></path>
  </svg>
);

export const ChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-chevron-right"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M9 6l6 6l-6 6"></path>
  </svg>
);
