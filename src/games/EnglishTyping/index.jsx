import { useEffect, useMemo, useRef, useState } from "react";

const SOFT_COLORS = ["#ff7fa0", "#6dc4ff", "#8ad36b", "#ffb86b", "#b79cff", "#6ed9c6"];
const NEXT_LETTER_DELAY_MS = 1500;
const IDLE_REPEAT_MS = 3000;
const FEMALE_VOICE_HINTS = [
  "female",
  "woman",
  "girl",
  "samantha",
  "victoria",
  "zira",
  "hazel",
  "aria",
  "susan",
  "katya",
];

function EnglishTyping({ onScoreUpdate }) {
  const letters = useMemo(() => {
    const capitals = Array.from({ length: 26 }, (_, index) =>
      String.fromCharCode(65 + index)
    );
    const lowercase = Array.from({ length: 26 }, (_, index) =>
      String.fromCharCode(97 + index)
    );

    return [...capitals, ...lowercase];
  }, []);

  const [score, setScore] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [isWrong, setIsWrong] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const wrongTimeoutRef = useRef(null);
  const nextLetterTimeoutRef = useRef(null);
  const idleRepeatTimeoutRef = useRef(null);
  const isWaitingNextLetterRef = useRef(false);

  const currentLetter = letters[letterIndex];
  const currentColor = SOFT_COLORS[letterIndex % SOFT_COLORS.length];

  const pickFemaleVoice = (voices) => {
    if (!voices.length) {
      return null;
    }

    const femaleVoice = voices.find((voice) => {
      const name = `${voice.name} ${voice.voiceURI}`.toLowerCase();
      return FEMALE_VOICE_HINTS.some((hint) => name.includes(hint));
    });

    return femaleVoice || voices[0];
  };

  const speakLetter = (letter) => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(letter);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = 0.92;
    utterance.pitch = 1.08;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const updateVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const voice = pickFemaleVoice(voices);
      if (voice) {
        setSelectedVoice(voice);
      }
    };

    updateVoice();
    window.speechSynthesis.addEventListener("voiceschanged", updateVoice);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", updateVoice);
    };
  }, []);

  useEffect(() => {
    speakLetter(currentLetter);
  }, [currentLetter, selectedVoice]);

  useEffect(() => {
    const startIdleRepeatTimer = () => {
      if (idleRepeatTimeoutRef.current) {
        clearTimeout(idleRepeatTimeoutRef.current);
      }

      idleRepeatTimeoutRef.current = setTimeout(function repeatCurrentLetter() {
        speakLetter(currentLetter);
        idleRepeatTimeoutRef.current = setTimeout(repeatCurrentLetter, IDLE_REPEAT_MS);
      }, IDLE_REPEAT_MS);
    };

    startIdleRepeatTimer();

    const handleKeyDown = (event) => {
      startIdleRepeatTimer();

      if (event.key.length !== 1) {
        return;
      }

      if (isWaitingNextLetterRef.current) {
        return;
      }

      const pressedKey = event.key.toLowerCase();
      const expectedKey = currentLetter.toLowerCase();

      if (pressedKey === expectedKey) {
        setScore((previous) => previous + 1);
        if (typeof onScoreUpdate === "function") {
          onScoreUpdate(1);
        }
        speakLetter(currentLetter);
        isWaitingNextLetterRef.current = true;
        nextLetterTimeoutRef.current = setTimeout(() => {
          setLetterIndex((previous) => (previous + 1) % letters.length);
          isWaitingNextLetterRef.current = false;
        }, NEXT_LETTER_DELAY_MS);
        return;
      }

      if (wrongTimeoutRef.current) {
        clearTimeout(wrongTimeoutRef.current);
      }

      setIsWrong(true);
      wrongTimeoutRef.current = setTimeout(() => {
        setIsWrong(false);
      }, 180);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (wrongTimeoutRef.current) {
        clearTimeout(wrongTimeoutRef.current);
      }
      if (nextLetterTimeoutRef.current) {
        clearTimeout(nextLetterTimeoutRef.current);
      }
      if (idleRepeatTimeoutRef.current) {
        clearTimeout(idleRepeatTimeoutRef.current);
      }
    };
  }, [currentLetter, letters.length, onScoreUpdate, selectedVoice]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (nextLetterTimeoutRef.current) {
        clearTimeout(nextLetterTimeoutRef.current);
      }
      if (idleRepeatTimeoutRef.current) {
        clearTimeout(idleRepeatTimeoutRef.current);
      }
      isWaitingNextLetterRef.current = false;
    };
  }, []);

  return (
    <div style={{ display: "grid", gap: "0.8rem" }}>
      <p style={{ margin: 0, color: "#49688f", textAlign: "center", fontWeight: 700 }}>
        Type the shown letter. Wrong keys just shake the card.
      </p>

      <div
        style={{
          position: "relative",
          minHeight: "420px",
          borderRadius: "20px",
          border: "2px solid #d6e8ff",
          background:
            "radial-gradient(circle at 16% 14%, rgba(255, 252, 201, 0.9) 0%, rgba(238, 246, 255, 1) 45%, rgba(228, 241, 255, 1) 100%)",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          padding: "1.2rem",
          animation: isWrong ? "typingWrongShake 180ms ease" : "none",
        }}
      >

        <div
          key={letterIndex}
          style={{
            fontSize: "clamp(120px, 26vw, 190px)",
            fontWeight: 900,
            color: currentColor,
            lineHeight: 1,
            textShadow: "0 10px 24px rgba(80, 118, 163, 0.24)",
            userSelect: "none",
            animation: "typingLetterReveal 260ms ease",
          }}
        >
          {currentLetter}
        </div>
      </div>

      <style>
        {`
          @keyframes typingLetterReveal {
            0% {
              opacity: 0;
              transform: scale(0.82);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes typingWrongShake {
            0%,
            100% {
              transform: translateX(0);
              box-shadow: inset 0 0 0 0 rgba(255, 76, 76, 0);
            }
            25% {
              transform: translateX(-6px);
            }
            50% {
              transform: translateX(6px);
              box-shadow: inset 0 0 0 3px rgba(255, 98, 98, 0.42);
            }
            75% {
              transform: translateX(-4px);
            }
          }
        `}
      </style>
    </div>
  );
}

export default EnglishTyping;
