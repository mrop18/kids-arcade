import { useEffect, useRef, useState } from "react";

const CONTAINER_HEIGHT = 400;
const BALL_SIZE = 64;
const BASKET_WIDTH = 150;
const BASKET_HEIGHT = 82;
const BASKET_BOTTOM = 20;

function DragBall({ onScoreUpdate }) {
  const containerRef = useRef(null);
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [isOverBasket, setIsOverBasket] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isScored, setIsScored] = useState(false);
  const [message, setMessage] = useState("Drag the basketball into the basket.");

  // Generates a safe random position while keeping the ball fully visible.
  const getRandomBallPosition = () => {
    const container = containerRef.current;

    if (!container) {
      return { x: 0, y: 0 };
    }

    const { width, height } = container.getBoundingClientRect();
    const maxX = Math.max(0, width - BALL_SIZE);
    // Reserve room for fixed basket so ball does not spawn under it.
    const verticalLimit = height - (BASKET_HEIGHT + BASKET_BOTTOM + 8);
    const maxY = Math.max(0, verticalLimit - BALL_SIZE);

    return {
      x: Math.floor(Math.random() * (maxX + 1)),
      y: Math.floor(Math.random() * (maxY + 1)),
    };
  };

  // Set first random position after mount when container dimensions are available.
  useEffect(() => {
    setBallPosition(getRandomBallPosition());
  }, []);

  const handleDragStart = (event) => {
    setIsDragging(true);
    event.dataTransfer.setData("text/plain", "ball");
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsOverBasket(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setIsOverBasket(true);
  };

  const handleDragLeave = () => {
    setIsOverBasket(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");

    if (data === "ball") {
      onScoreUpdate(5);
      setMessage("Nice shot! +5 points");
      setIsScored(true);
      setBallPosition(getRandomBallPosition());
      setTimeout(() => setIsScored(false), 280);
    }

    setIsDragging(false);
    setIsOverBasket(false);
  };

  return (
    <div style={{ display: "grid", gap: "0.8rem" }}>
      <p style={{ margin: 0, color: "#50709a" }}>{message}</p>

      <div
        ref={containerRef}
        style={{
          position: "relative",
          height: `${CONTAINER_HEIGHT}px`,
          overflow: "hidden",
          borderRadius: "18px",
          border: "2px solid #d7e8fa",
          background:
            "linear-gradient(180deg, rgba(228, 244, 255, 0.9) 0%, rgba(243, 252, 255, 1) 100%)",
        }}
      >
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          role="button"
          tabIndex={0}
          aria-label="Draggable basketball"
          style={{
            position: "absolute",
            left: `${ballPosition.x}px`,
            top: `${ballPosition.y}px`,
            width: `${BALL_SIZE}px`,
            height: `${BALL_SIZE}px`,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            fontSize: "48px",
            lineHeight: 1,
            userSelect: "none",
            cursor: isDragging ? "url('/cursor-big.png') 16 16, auto" : "url('/cursor-big-pointer.png') 16 16, auto",
            opacity: isDragging ? 0 : 1,
            transition: "left 260ms ease, top 260ms ease, opacity 120ms ease",
          }}
        >
          {"\uD83C\uDFC0"}
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            position: "absolute",
            left: "50%",
            bottom: `${BASKET_BOTTOM}px`,
            transform: `translateX(-50%) ${isScored ? "scale(1.06)" : "scale(1)"}`,
            width: `${BASKET_WIDTH}px`,
            height: `${BASKET_HEIGHT}px`,
            borderRadius: "18px 18px 24px 24px",
            border: `2px solid ${isOverBasket ? "#e07a00" : "#b76300"}`,
            background: isOverBasket
              ? "linear-gradient(180deg, #ffd08a 0%, #d17900 100%)"
              : "linear-gradient(180deg, #ffc983 0%, #bf6500 100%)",
            boxShadow: isOverBasket
              ? "0 0 0 5px rgba(255, 188, 92, 0.28)"
              : "0 8px 16px rgba(86, 54, 17, 0.18)",
            transition: "all 180ms ease",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "22px",
              background: "rgba(255, 234, 196, 0.8)",
              borderBottom: "2px solid rgba(120, 66, 8, 0.45)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              color: "#fff4e6",
              fontSize: "0.86rem",
              fontWeight: 800,
              letterSpacing: "0.02em",
            }}
          >
            Basket
          </div>
        </div>
      </div>
    </div>
  );
}

export default DragBall;
