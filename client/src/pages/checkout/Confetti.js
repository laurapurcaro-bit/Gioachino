import Confetti from "react-dom-confetti";

export default function ConfettiComponent({ active }) {
  const config = {
    angle: "360",
    spread: "360",
    startVelocity: "45",
    elementCount: "111",
    dragFriction: "0.19",
    duration: "4650",
    stagger: "1",
    width: "10px",
    height: "23px",
    perspective: "500px",
    colors: ["#FFB3B3", "#FFDBA4", "#FFE9AE", "#C1EFFF"],
    // colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  return <Confetti active={active} config={config} />;
}
