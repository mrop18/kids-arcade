import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import GameEngine from "../core/GameEngine";
import gameList from "../games/gameList";
import Container from "../ui/Container";
import Card from "../ui/Card";

function GamePage() {
  const { id } = useParams();

  // Page resolves a game by route id, then delegates gameplay to GameEngine.
  const selectedGame = useMemo(() => {
    return gameList.find((game) => game.id === id);
  }, [id]);

  if (!selectedGame) {
    return (
      <Container>
        <Card>
          <h2 style={{ marginTop: 0, color: "#1f3559" }}>Game not found</h2>
          <Link to="/" style={{ color: "#1f3559", fontWeight: 700 }}>
            Back to Dashboard
          </Link>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <div style={{ marginBottom: "0.8rem" }}>
        <Link to="/" style={{ color: "#1f3559", fontWeight: 700 }}>
          &larr; Back to Dashboard
        </Link>
      </div>
      <GameEngine game={selectedGame} />
    </Container>
  );
}

export default GamePage;
