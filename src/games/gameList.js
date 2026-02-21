import ClickTheStar from "./ClickTheStar";
import DragBall from "./DragBall";
import EnglishTyping from "./EnglishTyping";

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
  {
    id: "english-typing",
    name: "English Typing",
    description: "Type the shown letters in order to keep scoring forever.",
    component: EnglishTyping,
  },
];

export default gameList;
