import styling from "./Card.module.css";
import { Trans } from "react-i18next";

export default function Card({ post }) {
  return (
    <div className={styling.card}>
      <span className={styling.title}><Trans>{post.title}</Trans></span>
      <img src={post.img} alt="" className="img" />
      <p className={styling.desc}><Trans>{post.desc}</Trans></p>
      <button className={styling.cardButton}><Trans>Read more</Trans></button>
    </div>
  );
}
