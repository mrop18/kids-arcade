import ClickTheStar from "./ClickTheStar";
import DragBall from "./DragBall";

// Registry is the only file touched when adding a new game plugin.
const gameList = [
  {
    id: "click-the-star",
    name: "Click The Star",
    description: "Tap the star to earn one point every click.",
    component: ClickTheStar,
  },
  {
    id: "drag-ball",
    name: "Drag Ball",
    description: "Drag the ball and drop it inside the box for five points.",
    component: DragBall,
  },
];

export default gameList;
