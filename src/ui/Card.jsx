function Card({ children, style }) {
  return (
    <section
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "1rem",
        border: "2px solid #303030",
        boxShadow: "1px 2px 0px #303030",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

export default Card;
