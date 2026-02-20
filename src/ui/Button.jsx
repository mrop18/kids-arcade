function Button({ children, variant = "primary", style, ...props }) {
  const isSecondary = variant === "secondary";

  return (
    <button
      {...props}
      style={{
        border: "solid 2px #303030",
        borderRadius: "14px",
        padding: "0.65rem 1rem",
        fontSize: "1rem",
        fontWeight: 700,
        cursor: "pointer",
        background: isSecondary ? "#dcecff" : "#ffb347",
        color: isSecondary ? "#1f3559" : "#3b2d00",
        transition: "transform 150ms ease, box-shadow 150ms ease",
        boxShadow: "3px 6px 0px #303030",
        ...style,
      }}
      onMouseDown={(event) => {
        event.currentTarget.style.transform = "translateY(1px) scale(0.99)";
        event.currentTarget.style.boxShadow = "none";
      }}
      onMouseUp={(event) => {
        event.currentTarget.style.transform = "translateY(0) scale(1)";
        event.currentTarget.style.boxShadow = "3px 6px 0px #303030";
      }}
    >
      {children}
    </button>
  );
}

export default Button;
