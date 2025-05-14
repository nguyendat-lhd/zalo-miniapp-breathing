import React, { useEffect, useState, useRef } from "react";
import styled, { css, keyframes } from "styled-components";
import tw from "twin.macro";

const Container = styled.div`
  ${tw`flex flex-col items-center justify-center py-6 relative`}
  background: linear-gradient(135deg, #7ecbff 0%, #b993d6 100%);
  min-height: 400px;
  border-radius: 0;
  height: 100%;
  box-shadow: 0 4px 24px rgba(126, 203, 255, 0.2);
`;

const CircleContainer = styled.div`
  ${tw`flex items-center justify-center mb-4 relative`}
  width: 220px;
  height: 220px;
`;

const ButtonRow = styled.div`
  ${tw`flex gap-4 mt-6`}
`;

const StyledButton = styled.button<{ variant?: string }>`
  ${tw`px-6 py-2 rounded-lg font-semibold text-lg transition-colors duration-200`}
  background: ${({ variant }) =>
    variant === "hold"
      ? "linear-gradient(90deg, #f7971e 0%, #ffd200 100%)"
      : variant === "reset"
      ? "linear-gradient(90deg, #ff5858 0%, #f09819 100%)"
      : "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)"};
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const breatheAnim = keyframes`
  0% { stroke-dashoffset: 660; }
  100% { stroke-dashoffset: 0; }
`;

const ProgressCircle = styled.svg<{ animate: boolean; duration: number }>`
  transform: rotate(-90deg);
  circle {
    stroke: #fff;
    stroke-width: 10;
    fill: none;
    stroke-dasharray: 660;
    stroke-dashoffset: 660;
    ${({ animate, duration }) =>
      animate &&
      css`
        animation: ${breatheAnim} ${duration}s linear forwards;
      `}
  }
`;

const PhaseText = styled.div`
  ${tw`text-2xl font-semibold text-white mb-2`}
`;

const TimerText = styled.div`
  ${tw`text-lg text-white`}
`;

const phases = [
  { label: "Inhale", duration: 4 },
  { label: "Hold", duration: 7 },
  { label: "Exhale", duration: 8 },
];

const BreathingPractice: React.FC = () => {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(phases[0].duration);
  const [animate, setAnimate] = useState(false);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(phases[phaseIdx].duration);
    setAnimate(false);
    setTimeout(() => setAnimate(true), 50); // retrigger animation
  }, [phaseIdx]);

  useEffect(() => {
    if (!started || paused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setPhaseIdx((idx) => (idx + 1) % phases.length);
          return phases[(phaseIdx + 1) % phases.length].duration;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [phaseIdx, started, paused]);

  const handleReset = () => {
    setStarted(false);
    setPaused(false);
    setPhaseIdx(0);
    setTimeLeft(phases[0].duration);
    setAnimate(false);
    setTimeout(() => setAnimate(true), 50);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleStart = () => {
    setStarted(true);
    setPaused(false);
    setAnimate(true);
  };

  const handleHold = () => {
    setPaused((prev) => !prev);
    setAnimate((prev) => !prev);
  };

  return (
    <Container>
      <CircleContainer>
        <ProgressCircle
          width={220}
          height={220}
          animate={animate && started && !paused}
          duration={phases[phaseIdx].duration}
        >
          <circle
            cx="110"
            cy="110"
            r="105"
            style={{ stroke: "#fff", opacity: 0.15 }}
          />
          <circle
            cx="110"
            cy="110"
            r="105"
            style={{ stroke: started ? (paused ? "#ffd200" : "#43cea2") : "#7ecbff" }}
          />
        </ProgressCircle>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <PhaseText>{started ? phases[phaseIdx].label.toLowerCase() : "ready"}</PhaseText>
          <TimerText>{started ? `${timeLeft}s` : "--"}</TimerText>
        </div>
      </CircleContainer>
      <div tw="text-white text-base opacity-90 font-medium mb-2">4-7-8 Breathing Practice</div>
      <ButtonRow>
        {!started && (
          <StyledButton onClick={handleStart}>Start</StyledButton>
        )}
        {started && (
          <>
            <StyledButton variant="hold" onClick={handleHold}>
              {paused ? "Resume" : "Hold"}
            </StyledButton>
            <StyledButton variant="reset" onClick={handleReset}>Reset</StyledButton>
          </>
        )}
      </ButtonRow>
    </Container>
  );
};

export default BreathingPractice; 