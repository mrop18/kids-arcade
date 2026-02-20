import { useCallback, useMemo, useState } from "react";
import { addScore, resetScore } from "./ScoreManager";
import Button from "../ui/Button";
import Card from "../ui/Card";

function GameEngine({ game }) {
  // Single source of truth for score. Games only emit point events.
  const [score, setScore] = useState(0);

  const handleScoreUpdate = useCallback((points) => {
    setScore((currentScore) => addScore(currentScore, points));
  }, []);

  const handleReset = useCallback(() => {
    setScore(resetScore());
  }, []);

  // Dynamic game rendering keeps engine closed for modification, open for extension.
  const ActiveGame = game.component;

  const scoreLabel = useMemo(() => `Score: ${score}`, [score]);

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ margin: 0, color: "#1f3559" }}>{game.name}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <strong style={{ color: "#1f3559" }}>{scoreLabel}</strong>
            <Button variant="secondary" onClick={handleReset}>
              Reset Score
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <ActiveGame onScoreUpdate={handleScoreUpdate} />
      </Card>
    </div>
  );
}

export default GameEngine;
