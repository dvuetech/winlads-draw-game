"use client";

import { GameDataAdmin } from "@/models/game-data.model";
import { useEffect, useRef, useState } from "react";
import SlotMachineImage from "./SlotMachine";
import SlotLiveStream from "./SlotLiveStream";

const UPPERCASE_LETTERS0 = "ABCDEFGHIJKLM";
const UPPERCASE_LETTERS1 = "NOPQRSTUVWXYZ";

// Numbers 0-9
const NUMBERS = "0123456789";

// Special characters
const SPECIAL_CHARS = " .";

// Combine all or use separately
const ALL_CHARS =
  UPPERCASE_LETTERS0 + UPPERCASE_LETTERS1;

// Your current implementation uses only uppercase
const LETTERS = ALL_CHARS;

export interface SlotMachineComponentProps {
  data?: GameDataAdmin;
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const initText = "JANE D.";
const SlotMachineComponent = ({ data }: SlotMachineComponentProps) => {
  const [inputText, setInputText] = useState(Array(initText.length).fill(' ').join(''));
  const [spinning, setSpinning] = useState(false);
  const [reelPositions, setReelPositions] = useState<number[]>([]);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Initialize reel positions when input text changes
    setReelPositions(new Array(inputText.length).fill(0));
    reelRefs.current = reelRefs.current.slice(0, inputText.length);
  }, [inputText]);

  const spin = () => {
    console.log({ inputText, size: inputText.length });
    if (spinning || inputText.length === 0) return;

    setSpinning(true);

    // Start spinning from current positions
    reelRefs.current.forEach((reel, index) => {
      if (reel) {
        reel.style.transition = "none";
        reel.style.transform = `translateY(${reelPositions[index]}px)`;

        // Force a reflow
        void reel.offsetWidth;

        reel.style.transition = "transform 1s";
        reel.style.transform = `translateY(${
          reelPositions[index] % (LETTERS.length * 60)
        }px)`;
        reel.classList.add("reel-spinning");
      }
    });

    // Calculate final positions based on input text
    const newFinalPositions = inputText.split("").map((char) => {
      const upperChar = char.toUpperCase();
      const letterIndex = LETTERS.indexOf(upperChar);
      return letterIndex !== -1 ? -letterIndex * 60 : 0; // If not A-Z, stop at the top
    });

    // Stagger the stopping of each reel
    newFinalPositions.forEach((position, index) => {
      setTimeout(
        () => stopReel(index, position),
        1000 + index * 500 + Math.random() * 500
      );
    });
  };

  const stopReel = (reelIndex: number, finalPosition: number) => {
    const reelElement = reelRefs.current[reelIndex];
    if (!reelElement) return;

    // Stop the animation and set the final position
    reelElement.classList.remove("reel-spinning");
    reelElement.style.transition = "transform 0.5s ease-out";
    reelElement.style.transform = `translateY(${finalPosition}px)`;

    // Update the reel position in state
    setReelPositions((prev) => {
      const newPositions = [...prev];
      newPositions[reelIndex] = finalPosition;
      return newPositions;
    });

    // Check if all reels have stopped
    if (reelIndex === inputText.length - 1) {
      setTimeout(() => {
        setSpinning(false);
      }, 500);
    }
  };

  useEffect(() => {
    // Apply the positions from state when component mounts or reelPositions change
    reelPositions.forEach((position, index) => {
      const reelElement = reelRefs.current[index];
      if (reelElement) {
        reelElement.style.transform = `translateY(${position}px)`;
      }
    });
  }, [reelPositions]);

  const getReelCharacters = (char: string) => {
    const upperChar = char.toUpperCase();
    if (LETTERS.includes(upperChar)) {
      // For A-Z, create a circular list starting with the character
      const index = LETTERS.indexOf(upperChar);
      return LETTERS.slice(index) + LETTERS.slice(0, index) + upperChar;
    } else {
      // For non A-Z, add the character to the beginning and end of the alphabet
      return char + LETTERS + char;
    }
  };
  return (
    <div className="bg-[url('/slot/slot-bg.jpg')] bg-cover bg-center h-screen w-screen">
      <div className="flex justify-center items-center h-full flex-col gap-3">
        <SlotLiveStream />
        <SlotMachineImage
          onClickDraw={() => {
            setInputText(initText);
            setTimeout(() => {
              spin();
            }, 100);
          }}
        >
          <div
            className="flex mb-6 overflow-x-auto"
            style={{ maxWidth: "100vw" }}
          >
            {inputText.split("").map((char, reelIndex) => (
              <div
                key={reelIndex}
                className="relative w-20 h-60 border border-gray-300 overflow-hidden bg-white flex-shrink-0"
              >
                {/* Visible window for letters */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-[60px] border-y-2 border-transparent" />
                </div>

                {/* Scrolling reel */}
                <div
                  ref={(el) => (reelRefs.current[reelIndex] = el)}
                  style={{
                    position: "absolute",
                    top: "calc(50% - 30px)", // Center the current letter
                    width: "100%",
                    transform: `translateY(${reelPositions[reelIndex] || 0}px)`,
                  }}
                >
                  {getReelCharacters(char)
                    .split("")
                    .map((letter, index) => (
                      <div
                        key={index}
                        className="h-[60px] flex items-center justify-center text-4xl font-bold"
                      >
                        {letter}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <style jsx global>{`
            @keyframes spin {
              0% {
                transform: translateY(0);
              }
              100% {
                transform: translateY(-${(LETTERS.length + 1) * 60}px);
              }
            }

            .reel-spinning {
              animation: spin 1s linear infinite;
            }
          `}</style>
        </SlotMachineImage>
      </div>
    </div>
  );
};
export default SlotMachineComponent;
