import Card from "../components/cards/Card";
import { posts } from "../pages/data";
import "../styles/home.css";
export default function Home() {
  return (
    <div className="home">
      {posts.map((post) => (
        <Card key={post.id} post={post} />
      ))}
    </div>
  );
}
