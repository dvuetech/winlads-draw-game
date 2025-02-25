import React, { useState, useRef, useEffect } from "react";
import "./SlotMachine.css";

const SlotMachine = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const slotRefs = useRef([]);
  const mainSeqRef = useRef({});
  const startNumRef = useRef(0);

  const randomRange = (low, high) => {
    return Math.floor(Math.random() * (1 + high - low)) + low;
  };

  const playSpin = (refs, options = {}) => {
    if (refs.length === 0) return;

    // Initialize main sequence
    const mainSeqKey = `mainSeq${++startNumRef.current}`;
    mainSeqRef.current[mainSeqKey] = {
      totalSpinning: refs.length,
    };

    refs.forEach((ref, index) => {
      if (!ref.current) return;

      const defaultOptions = {
        easing: "ease-out",
        time: 3000,
        loops: 6,
        manualStop: false,
        endNum: 0,
        stopSeq: "random",
      };

      const mergedOptions = { ...defaultOptions, ...options };

      // If no specific endNum, randomize
      const endNum =
        mergedOptions.endNum || randomRange(1, ref.current.children.length);

      animateSpin(ref.current, {
        ...mergedOptions,
        endNum,
        mainSeqKey,
        subSeqIndex: index + 1,
      });
    });
  };

  const animateSpin = (el, options) => {
    const { time, loops, endNum, mainSeqKey, subSeqIndex } = options;

    const liHeight = el.children[0].offsetHeight;
    const liCount = el.children.length;
    const listHeight = liHeight * liCount;
    const spinSpeed = time / loops;

    // Track spinning state
    if (!mainSeqRef.current[mainSeqKey][`subSeq${subSeqIndex}`]) {
      mainSeqRef.current[mainSeqKey][`subSeq${subSeqIndex}`] = {
        spinning: true,
      };
    }

    // Clone first item to last for smooth animation
    const clonedItem = el.children[0].cloneNode(true);
    el.appendChild(clonedItem);

    let loopCount = 0;
    let animationId;

    const startSpin = () => {
      el.style.transition = `top ${spinSpeed}ms linear`;
      el.style.top = `-${listHeight}px`;
    };

    const lowerSpeed = () => {
      loopCount++;

      if (
        loopCount < loops ||
        (options.manualStop &&
          mainSeqRef.current[mainSeqKey][`subSeq${subSeqIndex}`].spinning)
      ) {
        startSpin();
      } else {
        endSpin();
      }
    };

    const endSpin = () => {
      const finalPos = -(liHeight * endNum - liHeight);

      el.style.transition = `top ${
        (spinSpeed * 1.5 * liCount) / endNum
      }ms ease-out`;
      el.style.top = `${finalPos}px`;

      // Remove cloned item after animation
      setTimeout(() => {
        el.removeChild(el.lastChild);

        // Update spinning state
        mainSeqRef.current[mainSeqKey].totalSpinning--;
        mainSeqRef.current[mainSeqKey][`subSeq${subSeqIndex}`].spinning = false;
        mainSeqRef.current[mainSeqKey][`subSeq${subSeqIndex}`].endNum = endNum;

        // Check if all spins are complete
        if (mainSeqRef.current[mainSeqKey].totalSpinning === 0) {
          setIsSpinning(false);
        }
      }, spinSpeed * 1.5);
    };

    startSpin();
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    playSpin(slotRefs.current);
  };

  // Initialize refs
  useEffect(() => {
    slotRefs.current = [useRef(null), useRef(null), useRef(null)];
  }, []);

  return (
    <div className="mainContainer">
      <div className="loader-container">
        <img
          src="https://i.ibb.co/R3cf4Gw/7639633.png"
          alt="Slot Machine Image"
          className="w-100"
        />
      </div>
      <div className="slot-machine">
        <div className="slotwrapper" id="example1">
          <ul ref={slotRefs.current[0]}>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
            <li className="text-danger">7</li>
            <li>8</li>
            <li>9</li>
            <li>10</li>
          </ul>
          <ul ref={slotRefs.current[1]}>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
            <li className="text-danger">7</li>
          </ul>
          <ul ref={slotRefs.current[2]}>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
            <li className="text-danger">7</li>
          </ul>
        </div>
        <img
          src="https://i.ibb.co/MfSZ71p/7670530.png"
          alt=""
          className="w-100"
        />
        <button
          type="button"
          className={`slot-machine-btn ${isSpinning ? "clicked" : ""}`}
          onClick={handleSpin}
        >
          <img
            src="https://i.ibb.co/0VTc2LZ/spin-btn.png"
            alt=""
            className="w-100"
          />
        </button>
      </div>
    </div>
  );
};

export default SlotMachine;
