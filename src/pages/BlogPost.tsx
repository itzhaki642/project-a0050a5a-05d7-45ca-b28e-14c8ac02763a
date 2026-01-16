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
import { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const pdfContentRef = useRef<HTMLDivElement>(null);
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
    // Remove HTML tags and get clean text
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

  const handleDownloadPdf = async () => {
    if (!post) return;
    
    setIsGeneratingPdf(true);
    toast.info('מכין את ה-PDF...');

    // Create a styled container for PDF
    const pdfContainer = document.createElement('div');
    pdfContainer.innerHTML = `
      <div style="font-family: 'Heebo', 'Arial', sans-serif; direction: rtl; padding: 40px; max-width: 700px; margin: 0 auto; background: #FFFBF5;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #E8D5C4;">
          <p style="color: #B5838D; font-size: 12px; margin-bottom: 8px;">Studio Topaz • Event Branding Studio</p>
          <h1 style="color: #1A1A1A; font-size: 28px; font-weight: 700; margin: 0; line-height: 1.4;">${post.title}</h1>
          ${post.published_at ? `<p style="color: #888; font-size: 12px; margin-top: 12px;">${format(new Date(post.published_at), 'dd בMMMM yyyy', { locale: he })}</p>` : ''}
        </div>
        
        <!-- Content -->
        <div style="font-size: 14px; line-height: 1.8; color: #333;">
          ${post.content
            .replace(/class="[^"]*"/g, '')
            .replace(/bg-accent\/30/g, '')
            .replace(/bg-secondary\/50/g, '')
            .replace(/bg-accent\/20/g, '')
            .replace(/bg-primary\/5/g, '')
            .replace(/<div([^>]*)>/g, '<div style="margin-bottom: 20px;"$1>')
            .replace(/<h2([^>]*)>/g, '<h2 style="color: #B5838D; font-size: 20px; font-weight: 700; margin-top: 30px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #E8D5C4;"$1>')
            .replace(/<h3([^>]*)>/g, '<h3 style="color: #B5838D; font-size: 16px; font-weight: 700; margin-top: 20px; margin-bottom: 10px;"$1>')
            .replace(/<p([^>]*)>/g, '<p style="margin-bottom: 12px; line-height: 1.8;"$1>')
            .replace(/<ul([^>]*)>/g, '<ul style="padding-right: 20px; margin-bottom: 15px;"$1>')
            .replace(/<ol([^>]*)>/g, '<ol style="padding-right: 20px; margin-bottom: 15px;"$1>')
            .replace(/<li([^>]*)>/g, '<li style="margin-bottom: 8px;"$1>')
            .replace(/<strong([^>]*)>/g, '<strong style="color: #B5838D; font-weight: 600;"$1>')
            .replace(/<a[^>]*href="[^"]*"[^>]*>([^<]*)<\/a>/g, '$1')
          }
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #E8D5C4; text-align: center;">
          <p style="color: #B5838D; font-size: 14px; font-weight: 500;">בעיצוב ובאהבה – Studio Topaz</p>
          <p style="color: #888; font-size: 11px; margin-top: 8px;">www.studio-topaz.co.il</p>
        </div>
      </div>
    `;

    try {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${post.title.replace(/[^\u0590-\u05FF\s]/g, '').trim() || 'article'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait'
        },
        pagebreak: { mode: 'avoid-all' }
      };

      await html2pdf().set(opt).from(pdfContainer).save();
      toast.success('ה-PDF הורד בהצלחה!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('שגיאה ביצירת ה-PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
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
