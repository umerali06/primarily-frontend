const GreenButton = ({
  children,
  type = "button",
  onClick,
  className = "",
  ...props
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`btn-primary hover:btn-primary-hover text-white font-semibold rounded-lg px-6 py-2 shadow transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default GreenButton;
