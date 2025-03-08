"use client";

import { GameDataAdmin } from "@/models/game-data.model";
import React, { useEffect, useRef, useState } from "react";
import SlotMachineImage from "./SlotMachine";
import SlotLiveStream from "./SlotLiveStream";
import confetti from "canvas-confetti";

// Define base characters we'll use for the spinning reels
// Including letters, numbers, and common punctuation
const BASE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVW0123456789 .,!?-_@#$%&*()[]{}:;'\"/\\<>+=~`^XYZ";

export interface SlotMachineComponentProps {
  textLength: number;
  onSpin: () => string;
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const SlotMachineComponent = React.forwardRef<
  HTMLDivElement,
  SlotMachineComponentProps
>(({ textLength, onSpin }, ref) => {
  const iLength = textLength;
  const [inputText, setInputText] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [reelPositions, setReelPositions] = useState<number[]>([]);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [status, setStatus] = useState<"init" | "spinning" | "stopped">("init");

  // Store custom character sets for each reel
  const [reelCharSets, setReelCharSets] = useState<string[]>([]);

  // Track if the spin button has been clicked
  const [hasSpun, setHasSpun] = useState(false);

  // Store idle animation speeds for each reel
  const [idleSpeeds, setIdleSpeeds] = useState<number[]>([]);

  // Update reel count and character sets when input text changes
  useEffect(() => {
    // Reset positions to show "A" for all reels when input changes
    setReelPositions(new Array(iLength).fill(0));

    // Ensure reelRefs has the correct length
    if (reelRefs.current.length !== iLength) {
      reelRefs.current = new Array(iLength).fill(null);
    }

    // Initialize character sets for each reel
    const newCharSets = inputText.split("").map((char) => {
      // If the character is not in our base set, add it at a random position
      if (BASE_CHARS.indexOf(char) === -1) {
        // Insert the character at a random position in the base set
        const randomPos = Math.floor(Math.random() * BASE_CHARS.length);
        return (
          BASE_CHARS.slice(0, randomPos) + char + BASE_CHARS.slice(randomPos)
        );
      }
      return BASE_CHARS;
    });

    // Generate random idle speeds for each reel
    const newIdleSpeeds = new Array(iLength).fill(0).map(
      () =>
        // Random speed between 15 and 25 seconds for a full rotation
        100 + Math.random() * 100
    );

    setReelCharSets(newCharSets);
    setIdleSpeeds(newIdleSpeeds);
  }, [iLength, inputText]);

  // Apply idle animations to reels
  useEffect(() => {
    // Skip if we've already spun or there's no input
    if (hasSpun || iLength === 0) return;

    // Small timeout to ensure refs are set
    const timer = setTimeout(() => {
      reelRefs.current.forEach((reel, index) => {
        if (reel) {
          // Remove any existing animations
          reel.classList.remove("reel-spinning");
          for (let i = 0; i < iLength; i++) {
            reel.classList.remove(`reel-idle-${i}`);
          }

          // Add the idle animation
          reel.classList.add(`reel-idle-${index}`);
        }
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [hasSpun, iLength]);

  // Function to spin the reels
  const spin = (winnerName: string) => {
    // Don't spin if already spinning or no input
    if (spinning || iLength === 0) return;

    setSpinning(true);
    setHasSpun(true);
    setStatus("spinning");
    // Start the spinning animation on all reels
    reelRefs.current.forEach((reel, index) => {
      if (reel) {
        // Remove idle animation and add spinning animation
        for (let i = 0; i < iLength; i++) {
          reel.classList.remove(`reel-idle-${i}`);
        }
        reel.classList.add("reel-spinning");
      }
    });

    // Calculate the exact positions for each character in the input text
    const targetPositions = winnerName.split("").map((char, index) => {
      // Get the character set for this specific reel
      const charSet = reelCharSets[index];

      // Find the position of the character in the character set
      const charIndex = charSet.indexOf(char);

      // Return the position (each character is 60px high)
      return -charIndex * 60;
    });

    // Log for debugging
    console.log("Input text:", winnerName);
    console.log("Target positions:", targetPositions);

    // Stop each reel with a staggered delay
    targetPositions.forEach((position, index) => {
      // Add increasing delays for each reel (2s base + index*500ms + small random)
      // Longer delay to allow for slower spinning animation
      setTimeout(
        () => stopReel(index, position, winnerName),
        2000 + index * 500 + Math.random() * 200
      );
    });
  };

  const showConfetti = () => {
    console.log("showConfetti");
    const duration = 6 * 1000;
    var end = Date.now() + duration;
    (function frame() {
      const colors = [
        "#77D1E6",
        "#FF6C2E",
        "#FFFFFF",
        "#D0D0D0",
        "#A0A0A0",
        "#484848",
        "#1A1A1A",
      ];

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
    setTimeout(() => {
      setStatus("init");
    }, 6000);
  };

  // Function to stop a specific reel at the target position
  const stopReel = (
    reelIndex: number,
    finalPosition: number,
    winnerName: string
  ) => {
    const reelElement = reelRefs.current[reelIndex];
    if (!reelElement) return;

    // Stop the spinning animation
    reelElement.classList.remove("reel-spinning");

    // Set transition for smooth stopping
    reelElement.style.transition = "transform 0.5s ease-out";

    // Set the final position
    reelElement.style.transform = `translateY(${finalPosition}px)`;

    // Log for debugging
    console.log(`Stopping reel ${reelIndex} at position ${finalPosition}`);

    // Update the position in state
    setReelPositions((prev) => {
      const newPositions = [...prev];
      newPositions[reelIndex] = finalPosition;
      return newPositions;
    });

    // Check if this is the last reel
    if (reelIndex === iLength - 1) {
      // Set spinning to false after a short delay
      setTimeout(() => {
        setStatus("stopped");
        setSpinning(false);
        showConfetti();
        playWinningMusic();
        // We do NOT restart idle animations after spinning is complete
      }, 500);
    }
  };

  // Create the character list for a specific reel
  // This ensures a continuous loop of characters
  const getReelCharacters = (reelIndex: number) => {
    if (reelIndex >= reelCharSets.length) return BASE_CHARS;

    const charSet = reelCharSets[reelIndex];

    // Create a circular list with the last character at the beginning
    // This ensures there's always a character visible above the first one
    const lastChar = charSet.charAt(charSet.length - 1);
    return lastChar + charSet + lastChar;
  };

  return (
    <div className="bg-[url('/slot/slot-bg.jpg')] bg-cover bg-center h-screen w-screen">
      <div className="flex justify-center items-center h-full flex-col gap-3">
        <SlotLiveStream />
        <SlotMachineImage
          onClickDraw={() => {
            setTimeout(() => {
              const winnerName = onSpin();
              setInputText(winnerName);
              spin(winnerName);
            }, 100);
          }}
        >
          <div className="w-full h-full relative">
            <div
              className="flex mb-6 overflow-x-auto absolute"
              style={{ maxWidth: "100vw", top: "-20px" }}
            >
              {inputText.split("").map((char, reelIndex) => {
                const width = Math.floor(590 / iLength);
                const fontSize = getFontSize(iLength);
                return (
                  <div
                    key={reelIndex}
                    className="relative w-20 h-60 border border-gray-300 overflow-hidden bg-white flex-shrink-0"
                    style={{ width: `${width}px` }}
                  >
                    {/* Visible window indicator */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-[60px] border-y-2 border-red-500" />
                    </div>

                    {/* The actual spinning reel */}
                    <div
                      ref={(el) => {
                        // Store the ref and immediately apply idle animation if not spun
                        reelRefs.current[reelIndex] = el;
                        if (el && !hasSpun) {
                          // Remove any existing animations
                          el.classList.remove("reel-spinning");
                          for (let i = 0; i < iLength; i++) {
                            el.classList.remove(`reel-idle-${i}`);
                          }
                          // Add idle animation immediately
                          el.classList.add(`reel-idle-${reelIndex}`);
                        }
                      }}
                      style={{
                        position: "absolute",
                        // Adjust top position to account for the extra character at the beginning
                        top: "calc(50% - 30px - 60px)", // Move up by one character height
                        width: "100%",
                        transform: hasSpun
                          ? `translateY(${reelPositions[reelIndex] || 0}px)`
                          : "translateY(60px)", // Start at A if not spun yet
                      }}
                      className={`reel-container `}
                    >
                      {/* Circular character set with last char at beginning and end */}
                      {getReelCharacters(reelIndex)
                        .split("")
                        .map((letter, index) => {
                          const isWinningText =
                            inputText?.charAt(reelIndex) === letter;
                          return (
                            <div
                              key={index}
                              className="h-[60px] flex items-center justify-center text-4xl "
                              style={{
                                fontSize: `${fontSize}px`,
                              }}
                            >
                              {letter === " " ? (
                                <span className="w-4 h-4 rounded-full"></span>
                              ) : (
                                <span
                                  className={
                                    status === "stopped" && isWinningText
                                      ? "selected-character"
                                      : ""
                                  }
                                >
                                  {letter}
                                </span>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
            <style jsx global>{`
              /* Main spinning animation - slower speed */
              @keyframes spin {
                0% {
                  transform: translateY(
                    60px
                  ); /* Start with first character in view */
                }
                100% {
                  transform: translateY(
                    -${(BASE_CHARS.length + 1) * 60}px
                  ); /* End with last character in view */
                }
              }

              .reel-spinning {
                animation: spin 3s linear infinite; /* Slower spin animation (3s instead of 1.5s) */
              }

              /* Generate idle animations for each potential reel */
              ${Array.from({ length: iLength })
                .map((_, index) => {
                  const duration = idleSpeeds[index] || 15 + Math.random() * 10;
                  return `
            @keyframes idle-spin-${index} {
              0% {
                transform: translateY(60px);
              }
              100% {
                transform: translateY(-${(BASE_CHARS.length + 1) * 60}px);
              }
            }
            
            .reel-idle-${index} {
              animation: idle-spin-${index} ${duration}s linear infinite;
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.2); }
            }
            
            @keyframes colorCycle {
              0%, 100% { color: #000; }
              10% { color: #e63946; }  /* Red */
              20% { color: #f1c40f; }  /* Yellow */
              30% { color: #2ecc71; }  /* Green */
              40% { color: #3498db; }  /* Blue */
              50% { color: #9b59b6; }  /* Purple */
              60% { color: #ff9f43; }  /* Orange */
              70% { color: #1abc9c; }  /* Teal */
              80% { color: #fd79a8; }  /* Pink */
              90% { color: #00cec9; }  /* Cyan */
            }
            
            @keyframes glow {
              0%, 100% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
              50% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6); }
            }
            
            /* Apply winning animation to the selected character */
            .selected-character {
              animation: 
                pulse 1s ease-in-out infinite,
                colorCycle 5s linear,
                glow 2s ease-in-out infinite;
            }
            
            /* Winning animation class */
            .winning-animation > div:nth-child(2) {
              animation: 
                pulse 1s ease-in-out infinite,
                colorCycle 5s linear,
                glow 2s ease-in-out infinite;
            }
          `;
                })
                .join("\n")}
            `}</style>
          </div>
        </SlotMachineImage>
      </div>
    </div>
  );
});

SlotMachineComponent.displayName = "SlotMachineComponent";

export default SlotMachineComponent;

// Play the audio
function playWinningMusic() {
  const audio = new Audio("/audio/jackpot-sound.mp3");

  audio.volume = 0.5;
  audio.play().catch((error) => {
    console.log("Failed to play audio:", error);
  });
}
const getFontSize = (iLength: number) => {
  switch (iLength) {
    case 1:
      return 50;
    case 2:
    case 3:
      return 60;
    case 4:
      return 60;
    case 5:
      return 60;
    case 6:
      return 60;
    case 7:
      return 60;
    case 8:
      return 70;
    default:
      return Math.floor(590 / iLength);
  }
};
