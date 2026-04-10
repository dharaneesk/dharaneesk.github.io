import { lazy, Suspense, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReadingProgressBar from '@/components/blog/ReadingProgressBar';
import LinkedInCopyButton from '@/components/blog/LinkedInCopyButton';
import CodeBlock from '@/components/blog/CodeBlock';
import { blogPosts } from '@/data/blogPosts';
import { MDXProvider } from '@mdx-js/react';

const components = {
  code: CodeBlock,
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const postInfo = blogPosts.find(p => p.slug === slug);

  if (!postInfo) {
    return <Navigate to="/404" replace />;
  }

  // Dynamically import the MDX file based on the slug
  const MdxContent = lazy(() => import(`@/content/blog/${slug}.mdx`));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const postUrl = typeof window !== 'undefined' ? window.location.href : '';

  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/#blog');
    setTimeout(() => {
      const element = document.getElementById('blog');
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80,
          behavior: 'auto',
        });
      }
    }, 10);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ReadingProgressBar />
      <Navbar />

      <main className="flex-grow pt-32 pb-16">
        <button
          onClick={handleClose}
          className="fixed top-24 right-4 sm:right-8 lg:right-12 z-40 p-3 rounded-full bg-background border border-border shadow-lg hover:bg-secondary text-foreground transition-all duration-200 hover:scale-110 flex items-center justify-center group"
          aria-label="Close article and return to blog"
          title="Close"
        >
          <X className="w-6 h-6 group-hover:text-destructive transition-colors" />
        </button>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 relative">

          <header className="mb-12 text-center pt-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              {postInfo.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-muted-foreground">
              <span>{postInfo.date}</span>
              <span>•</span>
              <span>{postInfo.readTime}</span>
            </div>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-foreground/80 prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-li:text-foreground/80
            prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none"
          >
            <Suspense fallback={<div className="py-20 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div></div>}>
              <MDXProvider components={components}>
                <MdxContent />
              </MDXProvider>
            </Suspense>
          </div>

          <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="font-semibold mb-1">Found this valuable?</h3>
              <p className="text-sm text-muted-foreground">Share this deep dive with your network.</p>
            </div>
            <LinkedInCopyButton hook={postInfo.hook} url={postUrl} />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
