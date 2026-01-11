import { useEffect, useRef, useState } from "react";

const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const CORGI_WIDTH = 60;
const TREAT_SIZE = 30;

export default function App() {
  const [corgiX, setCorgiX] = useState(GAME_WIDTH / 2 - CORGI_WIDTH / 2);
  const [treats, setTreats] = useState([]);
  const [score, setScore] = useState(0);

  // Ref to avoid restarting the game loop
  const corgiXRef = useRef(corgiX);

  // Keep ref in sync with state
  useEffect(() => {
    corgiXRef.current = corgiX;
  }, [corgiX]);

  // Move corgi with arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setCorgiX((x) => Math.max(0, x - 20));
      }
      if (e.key === "ArrowRight") {
        setCorgiX((x) => Math.min(GAME_WIDTH - CORGI_WIDTH, x + 20));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Spawn treats
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      setTreats((prev) => [
        ...prev,
        {
          id: Math.random(),
          x: Math.random() * (GAME_WIDTH - TREAT_SIZE),
          y: 0,
        },
      ]);
    }, 800);

    return () => clearInterval(spawnInterval);
  }, []);

  // Game loop (stable, no dependency on corgiX)
  useEffect(() => {
    const gameLoop = setInterval(() => {
      setTreats((prev) =>
        prev
          .map((t) => ({ ...t, y: t.y + 8 }))
          .filter((t) => {
            const hit =
              t.y + TREAT_SIZE >= GAME_HEIGHT - 60 &&
              t.x + TREAT_SIZE > corgiXRef.current &&
              t.x < corgiXRef.current + CORGI_WIDTH;

            if (hit) {
              setScore((s) => s + 1);
              return false;
            }

            return t.y < GAME_HEIGHT;
          })
      );
    }, 50);

    return () => clearInterval(gameLoop);
  }, []);

  return (
    <div className="container">
      <h1>🐶 Corgi Treat Catch</h1>
      <p>Score: {score}</p>

      <div className="game">
        {treats.map((t) => (
          <div
            key={t.id}
            className="treat"
            style={{ left: t.x, top: t.y }}
          />
        ))}

        <div
          className="corgi"
          style={{ left: corgiX }}
        />
      </div>
    </div>
  );
}
