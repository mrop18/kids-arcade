function Container({ children }) {
  return (
    <main
      style={{
        width: "min(980px, 92vw)",
        margin: "0px auto",
        paddingTop: "2rem",
      }}
    >
      {children}
    </main>
  );
}

export default Container;
