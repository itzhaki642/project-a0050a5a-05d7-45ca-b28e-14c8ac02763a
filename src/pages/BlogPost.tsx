import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { ArrowRight, Calendar, Clock, Share2, Download } from 'lucide-react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Estimate reading time based on content length
  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  // Extract plain text from HTML content for WhatsApp sharing
  const getPlainTextForSharing = (content: string, title: string) => {
    const plainText = content
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    return `*${title}*\n\n${plainText}\n\n---\nמתוך הבלוג של סטודיו טופז 🌸`;
  };

  const handleShareWhatsApp = () => {
    if (!post) return;
    
    const textToShare = getPlainTextForSharing(post.content, post.title);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(textToShare)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('נפתח WhatsApp לשיתוף');
  };

  const handleDownloadPdf = () => {
    if (!post) return;
    
    setIsGeneratingPdf(true);
    toast.info('פותח חלון הדפסה - בחרי "שמור כ-PDF"');

    // Create a print-friendly version in a new window
    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <title>${post.title} | סטודיו טופז</title>
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Heebo', 'Arial', sans-serif;
            direction: rtl;
            padding: 40px;
            max-width: 700px;
            margin: 0 auto;
            background: #FFFBF5;
            color: #333;
            line-height: 1.8;
            font-size: 14px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #E8D5C4;
          }
          .header .studio { color: #B5838D; font-size: 12px; margin-bottom: 8px; }
          .header h1 { color: #1A1A1A; font-size: 26px; font-weight: 700; line-height: 1.4; margin: 0; }
          .header .date { color: #888; font-size: 12px; margin-top: 12px; }
          h2 {
            color: #B5838D;
            font-size: 18px;
            font-weight: 700;
            margin-top: 28px;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 2px solid #E8D5C4;
          }
          h3 { color: #B5838D; font-size: 15px; font-weight: 700; margin-top: 18px; margin-bottom: 8px; }
          p { margin-bottom: 12px; }
          ul, ol { padding-right: 24px; margin-bottom: 12px; }
          li { margin-bottom: 6px; }
          strong { color: #B5838D; font-weight: 600; }
          .card {
            background: #FDF8F3;
            border: 1px solid #E8D5C4;
            border-radius: 12px;
            padding: 20px;
            margin: 16px 0;
          }
          .blessing-card {
            background: #FDF8F3;
            border: 1px solid #E8D5C4;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            margin: 20px 0;
          }
          .blessing-text { font-size: 18px; font-weight: 500; line-height: 2; }
          .ingredient-card {
            background: #FDF8F3;
            padding: 12px 16px;
            border-right: 4px solid #B5838D;
            border-radius: 8px;
            margin-bottom: 10px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #E8D5C4;
            text-align: center;
          }
          .footer .brand { color: #B5838D; font-size: 14px; font-weight: 500; }
          .footer .url { color: #888; font-size: 11px; margin-top: 8px; }
          @media print {
            body { padding: 20px; }
            @page { margin: 15mm; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <p class="studio">Studio Topaz • Event Branding Studio</p>
          <h1>${post.title}</h1>
          ${post.published_at ? `<p class="date">${format(new Date(post.published_at), 'dd בMMMM yyyy', { locale: he })}</p>` : ''}
        </div>
        
        <div class="content">
          ${post.content
            .replace(/class="[^"]*"/g, '')
            .replace(/<a[^>]*href="[^"]*"[^>]*>([^<]*)<\/a>/g, '$1')
          }
        </div>
        
        <div class="footer">
          <p class="brand">בעיצוב ובאהבה – Studio Topaz</p>
          <p class="url">www.studio-topaz.co.il</p>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
    
    setIsGeneratingPdf(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background">
          <div className="container mx-auto px-4 py-16 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <div className="flex gap-4 mb-8">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="aspect-[16/9] w-full mb-10 rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background flex items-center justify-center">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">הפוסט לא נמצא</h1>
            <p className="text-muted-foreground mb-8">מצטערים, לא הצלחנו למצוא את המאמר שחיפשת</p>
            <Link to="/blog">
              <Button size="lg" className="rounded-full px-8">
                חזרה לבלוג
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const readingTime = getReadingTime(post.content);

  return (
    <Layout>
      <Helmet>
        <title>{post.meta_title || post.title} | סטודיו טופז</title>
        <meta name="description" content={post.meta_description || post.excerpt || ''} />
        {post.featured_image && <meta property="og:image" content={post.featured_image} />}
      </Helmet>

      {/* Hero Section with Featured Image */}
      <div className="relative bg-gradient-to-b from-secondary/50 to-background">
        <div className="container mx-auto px-4 pt-8 pb-12 max-w-4xl">
          {/* Back Button */}
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            <span>חזרה לבלוג</span>
          </Link>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {post.title}
          </h1>
          
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
            {post.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time>
                  {format(new Date(post.published_at), 'dd בMMMM yyyy', { locale: he })}
                </time>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readingTime} דקות קריאה</span>
            </div>
            
            {/* Share & Download Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-full text-sm font-medium hover:bg-[#128C7E] transition-colors"
                aria-label="שתף בוואטסאפ"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">שתף בוואטסאפ</span>
              </button>
              
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                aria-label="הורד כ-PDF"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{isGeneratingPdf ? 'מכין...' : 'הורד PDF'}</span>
              </button>
            </div>
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-border">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        <div 
          className="prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-foreground
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-primary prose-a:font-medium prose-a:underline-offset-4 hover:prose-a:text-primary/80
            prose-strong:text-foreground prose-strong:font-semibold
            prose-ul:my-6 prose-ul:pr-6
            prose-ol:my-6 prose-ol:pr-6
            prose-li:text-foreground/90 prose-li:my-2
            prose-blockquote:border-r-4 prose-blockquote:border-primary prose-blockquote:bg-secondary/30 
            prose-blockquote:pr-6 prose-blockquote:py-4 prose-blockquote:pl-4 prose-blockquote:rounded-lg
            prose-blockquote:not-italic prose-blockquote:text-foreground/80
            prose-img:rounded-xl prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Bottom CTA */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="bg-secondary/30 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold mb-3">נהנית מהמאמר?</h3>
            <p className="text-muted-foreground mb-6">גלו עוד רעיונות ומאמרים מעניינים בבלוג שלנו</p>
            <Link to="/blog">
              <Button size="lg" className="rounded-full px-8">
                לכל המאמרים
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
