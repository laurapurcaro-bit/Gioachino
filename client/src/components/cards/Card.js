import styling from "./Card.module.css";

export default function Card({ post }) {
  return (
    <div className={styling.card}>
      <span className={styling.title}>{post.title}</span>
      <img src={post.img} alt="" className="img" />
      <p className={styling.desc}>{post.desc}</p>
      <button className={styling.cardButton}>Read more</button>
    </div>
  );
}
