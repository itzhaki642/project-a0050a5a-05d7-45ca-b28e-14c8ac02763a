import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Upload, Image as ImageIcon, Save, Eye } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const AdminBlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    published: false,
    meta_title: '',
    meta_description: '',
  });
  const [isUploading, setIsUploading] = useState(false);

  const isEditing = !!id;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ['blog-post-edit', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        featured_image: post.featured_image || '',
        published: post.published || false,
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
      });
    }
  }, [post]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value),
    }));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      if (url) {
        setFormData(prev => ({ ...prev, featured_image: url }));
        toast({ title: 'התמונה הועלתה בהצלחה' });
      } else {
        toast({ title: 'שגיאה בהעלאת התמונה', variant: 'destructive' });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      if (url) {
        const imageHtml = `<img src="${url}" alt="" class="my-4 rounded-lg max-w-full" />`;
        setFormData(prev => ({
          ...prev,
          content: prev.content + '\n' + imageHtml + '\n',
        }));
        toast({ title: 'התמונה הוספה לתוכן' });
      } else {
        toast({ title: 'שגיאה בהעלאת התמונה', variant: 'destructive' });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const postData = {
        ...data,
        author_id: user?.id,
        published_at: data.published ? new Date().toISOString() : null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({
        title: 'נשמר בהצלחה',
        description: isEditing ? 'הפוסט עודכן' : 'הפוסט נוצר',
      });
      navigate('/admin/blog');
    },
    onError: (error: any) => {
      let message = 'לא ניתן לשמור את הפוסט';
      if (error.message?.includes('duplicate key')) {
        message = 'כתובת URL כבר קיימת, בחר כתובת אחרת';
      }
      toast({
        title: 'שגיאה',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content) {
      toast({
        title: 'שדות חסרים',
        description: 'נא למלא כותרת, כתובת URL ותוכן',
        variant: 'destructive',
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  if (loading || (isEditing && isLoadingPost)) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p>טוען...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <Helmet>
        <title>{isEditing ? 'עריכת פוסט' : 'פוסט חדש'} | סטודיו טופז</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <button
          onClick={() => navigate('/admin/blog')}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה לרשימה
        </button>

        <h1 className="text-3xl font-bold mb-8">
          {isEditing ? 'עריכת פוסט' : 'פוסט חדש'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">כותרת *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="mt-1"
              placeholder="כותרת הפוסט"
            />
          </div>

          {/* Slug */}
          <div>
            <Label htmlFor="slug">כתובת URL *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="mt-1"
              dir="ltr"
              placeholder="post-url"
            />
            <p className="text-xs text-muted-foreground mt-1">
              /blog/{formData.slug || 'כתובת-הפוסט'}
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <Label htmlFor="excerpt">תקציר</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              className="mt-1"
              rows={2}
              placeholder="תקציר קצר לתצוגה ברשימת הפוסטים"
            />
          </div>

          {/* Featured Image */}
          <div>
            <Label>תמונה ראשית</Label>
            <div className="mt-1 flex gap-4 items-start">
              {formData.featured_image ? (
                <div className="relative">
                  <img
                    src={formData.featured_image}
                    alt="Featured"
                    className="w-40 h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                </div>
              ) : null}
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 ml-2" />
                {isUploading ? 'מעלה...' : 'העלה תמונה'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="content">תוכן *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => contentFileInputRef.current?.click()}
                disabled={isUploading}
              >
                <ImageIcon className="w-4 h-4 ml-1" />
                הוסף תמונה
              </Button>
              <input
                ref={contentFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleContentImageUpload}
                className="hidden"
              />
            </div>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="mt-1 font-mono text-sm"
              rows={15}
              placeholder="תוכן הפוסט (HTML נתמך)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              ניתן להשתמש ב-HTML לעיצוב (כותרות, פסקאות, רשימות וכו')
            </p>
          </div>

          {/* SEO Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">הגדרות SEO</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="meta_title">כותרת Meta</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  className="mt-1"
                  placeholder="כותרת לתוצאות החיפוש (אופציונלי)"
                />
              </div>
              <div>
                <Label htmlFor="meta_description">תיאור Meta</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  className="mt-1"
                  rows={2}
                  placeholder="תיאור לתוצאות החיפוש (אופציונלי)"
                />
              </div>
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center gap-3 border-t pt-6">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
            />
            <Label htmlFor="published">פרסם מיד</Label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={saveMutation.isPending}>
              <Save className="w-4 h-4 ml-2" />
              {saveMutation.isPending ? 'שומר...' : 'שמור'}
            </Button>
            {formData.slug && (
              <Button
                type="button"
                variant="outline"
                onClick={() => window.open(`/blog/${formData.slug}`, '_blank')}
              >
                <Eye className="w-4 h-4 ml-2" />
                תצוגה מקדימה
              </Button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AdminBlogEditor;
