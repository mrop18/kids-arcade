import { useNavigate } from "react-router-dom";
import gameList from "../games/gameList";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Container from "../ui/Container";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <Container>
      <header style={{ marginBottom: "1rem", padding: "1rem" }}>
        <h1 style={{ margin: 0, color: "#1f3559" }}>Kids Learning Arcade</h1>
        <p style={{ color: "#50709a" }}>Choose a game and start playing.</p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
          width: "100%",
        }}
      >
        {gameList.map((game) => (
          <Card key={game.id}>
            <div style={{ display: "grid", gap: "0.8rem" }}>
              <h2 style={{ margin: 0, color: "#1f3559", fontSize: "1.2rem" }}>{game.name}</h2>
              <p style={{ margin: 0, color: "#50709a" }}>{game.description}</p>
              <Button onClick={() => navigate(`/game/${game.id}`)}>Play</Button>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}

export default Dashboard;
