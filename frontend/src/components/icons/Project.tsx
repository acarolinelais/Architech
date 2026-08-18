import type { SVGProps } from "react";

export function ProjectIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="27"
      height="30"
      viewBox="0 0 27 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.25 26.6151L13.25 28.1071L10.25 26.6151M13.25 28.1071V24.377M4.25 23.631L1.25 22.1389V18.4087M4.25 5.72619L1.25 7.21825V10.9484M1.25 7.21825L4.25 8.71032M10.25 2.74206L13.25 1.25L16.25 2.74206M25.25 10.9484V7.21825L22.25 5.72619M25.25 7.21825L22.25 8.71032M13.25 13.1865L10.25 11.6944M13.25 13.1865L16.25 11.6944M13.25 13.1865V16.9167M22.25 23.631L25.25 22.1389V18.4087"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
