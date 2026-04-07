import { Clock, Calendar, ArrowUpRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { BlogPost } from '@/data/blogPosts';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link to={`/blog/${post.slug}`} className="block h-full group">
      <Card 
        className={cn(
          "overflow-hidden bg-card/80 border border-border/50",
          "backdrop-blur-md shadow-lg hover:shadow-xl hover:border-primary/20 hover:bg-card transition-all duration-500",
          "h-full flex flex-col relative group-hover:-translate-y-1"
        )}
      >
        {post.featured && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-3 py-1 bg-primary/90 text-primary-foreground rounded-full text-xs font-medium shadow-lg">
            <Star size={12} className="fill-current" />
            <span>Featured</span>
          </div>
        )}
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex gap-4 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{post.readTime}</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-3 flex items-start gap-2">
            {post.title}
            <span className="text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] translate-y-[10px] group-hover:translate-x-[0px] group-hover:translate-y-[0px] transition-all duration-300">
              <ArrowUpRight size={18} />
            </span>
          </h3>
            
          <p className="text-sm text-foreground/70 mb-6 flex-grow">
            {post.hook}
          </p>
          
        </CardContent>
      </Card>
    </Link>
  );
}
