import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { postsApi } from "../api/posts";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { PublicNav } from "../components/PublicNav";
import { VideoEmbed } from "../components/VideoEmbed";
import type { Post } from "../types";
import { toDirectImageUrl } from "../utils/mediaUrl";

export function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    postsApi
      .get(Number(id))
      .then(setPost)
      .catch((err) => setError(err instanceof Error ? err.message : "Post not found"));
  }, [id]);

  return (
    <div className="page">
      <PublicNav />
      <main className="main-content">
        <div className="container">
          {error && <p className="message message-error">{error}</p>}
          {!error && !post && <p className="empty-state">Memuat...</p>}
          {post && (
            <article className="card post-detail-article">
              <span className="badge badge-gold">{post.type}</span>
              <h1 className="post-detail-title">{post.title}</h1>
              {post.published_at && (
                <p className="post-card-date">
                  {new Date(post.published_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
              {post.image_url && (
                <ImageWithFallback
                  src={toDirectImageUrl(post.image_url)}
                  alt={post.title}
                  className="post-detail-image"
                />
              )}
              {post.video_url && <VideoEmbed url={post.video_url} />}
              <p className="post-detail-body">{post.content}</p>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
