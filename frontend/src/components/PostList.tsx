import { Link } from "react-router-dom";
import type { Post } from "../types";
import { toDirectImageUrl } from "../utils/mediaUrl";
import { ImageWithFallback } from "./ImageWithFallback";
import { VideoEmbed } from "./VideoEmbed";

interface Props {
  posts: Post[];
}

export function PostList({ posts }: Props) {
  if (posts.length === 0) {
    return <p className="empty-state">Belum ada konten untuk ditampilkan.</p>;
  }

  return (
    <div className="card post-feed">
      {posts.map((post) => (
        <Link to={`/posts/${post.id}`} key={post.id} className="post-feed-item">
          <div className="post-feed-item-header">
            <span className="badge badge-gold">{post.type}</span>
            {post.published_at && (
              <span className="post-card-date">
                {new Date(post.published_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
          <h3 className="post-card-title">{post.title}</h3>
          {post.image_url && (
            <ImageWithFallback
              src={toDirectImageUrl(post.image_url)}
              alt={post.title}
              className="post-feed-media"
            />
          )}
          {post.video_url && <VideoEmbed url={post.video_url} />}
          {post.content && (
            <p className="post-card-excerpt">
              {post.content.length > 140 ? `${post.content.slice(0, 140)}…` : post.content}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
