import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <Helmet>
        <title>בלוג | סטודיו טופז - טיפים והשראה לאירועים</title>
        <meta name="description" content="בלוג סטודיו טופז - טיפים, השראה ורעיונות לעיצוב אירועים, ימי הולדת ומזכרות מותאמות אישית" />
      </Helmet>

      <div className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">הבלוג שלנו</h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            טיפים, השראה ורעיונות לאירועים מושלמים
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {post.featured_image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  {post.published_at && (
                    <time className="text-xs text-muted-foreground">
                      {format(new Date(post.published_at), 'dd בMMMM yyyy', { locale: he })}
                    </time>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">אין עדיין פוסטים בבלוג</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Blog;
