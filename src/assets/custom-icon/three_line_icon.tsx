interface ThreeLineIconProps {
  className?: string;
}

export default function ThreeLineIcon(props: ThreeLineIconProps) {
  return (
    <svg
      viewBox="0 0 39 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <path d="M1 1H38" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <path d="M1 9H38" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <path d="M1 17H38" stroke="black" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
