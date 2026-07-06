import { api } from "./client";
import type { Post, PostType } from "../types";

interface PostInput {
  type: PostType;
  title: string;
  content?: string;
  image_url?: string | null;
  video_url?: string | null;
  is_published?: boolean;
}

export const postsApi = {
  list: (type?: PostType) => api.get<Post[]>(type ? `/posts?type=${type}` : "/posts"),
  get: (id: number) => api.get<Post>(`/posts/${id}`),
  create: (post: PostInput) => api.post<Post>("/posts", post),
  update: (id: number, post: Partial<PostInput>) => api.put<Post>(`/posts/${id}`, post),
  remove: (id: number) => api.delete<void>(`/posts/${id}`),
};
