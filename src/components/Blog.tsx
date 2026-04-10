import BlogCard from '@/components/blog/BlogCard';
import { blogPosts } from '@/data/blogPosts';

export default function Blog() {
  return (
    <section id="blog" className="section">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-12 max-w-2xl mx-auto text-center">
          <h2 className="section-heading">
            <span className="text-primary">{'<'}</span>
            Deep Dives
            <span className="text-primary">{'/>'}</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-4">
            Technical insights and Knowledge sharing on AI, Infrastructure, Systems, and Backend engineering.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-xl text-muted-foreground">No posts found yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
