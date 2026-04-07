

export interface BlogPost {
  title: string;
  slug: string;
  hook: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    title: "Why Your CUDA Kernel is Slower Than Naive Pytorch",
    slug: "cuda-memory-optimization",
    hook: "Writing custom CUDA kernels? Here's why your 'optimized' C++ code might actually be bottlenecked by memory latency, and how to fix it.",
    date: "A few weeks ago",
    readTime: "7 min read",
    featured: true
  },
];
