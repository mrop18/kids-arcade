import { useEffect, useRef, useState } from "react";

const STAR_SIZE = 56;
const MIN_STAR_SIZE = 30;
const CONTAINER_HEIGHT = 400;

function ClickTheStar({ onScoreUpdate }) {
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPopped, setIsPopped] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const getCurrentSize = (count) => {
    const sizeReduction = Math.floor(count / 10) * 2;
    return Math.max(MIN_STAR_SIZE, STAR_SIZE - sizeReduction);
  };

  // Computes a random top/left that keeps the full star inside the container.
  const getRandomPosition = (countForBounds = clickCount) => {
    const container = containerRef.current;

    if (!container) {
      return { x: 0, y: 0 };
    }

    const { width, height } = container.getBoundingClientRect();
    const currentSize = getCurrentSize(countForBounds);
    const maxX = Math.max(0, width - currentSize);
    const maxY = Math.max(0, height - currentSize);

    return {
      x: Math.floor(Math.random() * (maxX + 1)),
      y: Math.floor(Math.random() * (maxY + 1)),
    };
  };

  const currentSize = getCurrentSize(clickCount);

  // Sets the initial random position after first render when container dimensions exist.
  useEffect(() => {
    setPosition(getRandomPosition());
  }, []);

  const handleStarClick = () => {
    onScoreUpdate(1);
    setClickCount((previous) => {
      const next = previous + 1;
      setPosition(getRandomPosition(next));
      return next;
    });
    setIsPopped(true);
    setTimeout(() => setIsPopped(false), 140);
  };

  return (
    <div style={{ display: "grid", gap: "0.8rem" }}>
      <p style={{ margin: 0, color: "#50709a", textAlign: "center" }}>
        Catch the star. Every click gives +1 point and moves it.
      </p>

      <div
        ref={containerRef}
        style={{
          position: "relative",
          height: `${CONTAINER_HEIGHT}px`,
          overflow: "hidden",
          borderRadius: "18px",
          border: "2px dashed #b9d3ef",
          background:
            "radial-gradient(circle at top, rgba(255, 238, 179, 0.6), rgba(236, 245, 255, 1))",
        }}
      >
        <button
          type="button"
          onClick={handleStarClick}
          aria-label="Click the star"
          style={{
            position: "absolute",
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${currentSize}px`,
            height: `${currentSize}px`,
            border: "none",
            background: "transparent",
            fontSize: `${Math.floor(currentSize * 0.75)}px`,
            lineHeight: 1,
            cursor: "url('/cursor-big-pointer.png') 16 16, auto",
            transform: isPopped ? "scale(1.18)" : "scale(1)",
            transition:
              "left 320ms ease, top 320ms ease, width 180ms ease, height 180ms ease, font-size 180ms ease, transform 140ms ease",
            animation: isPopped ? "none" : "starIdleBounce 1.4s ease-in-out infinite",
            padding: 0,
          }}
        >
          {"\u2B50"}
        </button>
      </div>
      <style>
        {`
          @keyframes starIdleBounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-4px) scale(1.03); }
          }
        `}
      </style>
    </div>
  );
}

export default ClickTheStar;
