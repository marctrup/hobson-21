import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Eye, Upload, Bold, Italic, Underline, Link, List, ListOrdered, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ImageUpload } from "@/components/blog/ImageUpload";

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  featured_image_alt: string;
  status: 'draft' | 'published';
  meta_title: string;
  meta_description: string;
  reading_time: number;
  categories: string[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const isEditing = Boolean(id && id !== 'new');

  const [post, setPost] = useState<BlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    featured_image_alt: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    reading_time: 5,
    categories: []
  });

  const [originalPost, setOriginalPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/auth');
      return;
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('id, name, slug')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const fetchPost = async () => {
    if (!id) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        featured_image_url,
        featured_image_alt,
        status,
        meta_title,
        meta_description,
        reading_time,
        blog_post_categories (
          category_id
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching post:', error);
      toast({
        title: "Error",
        description: "Failed to fetch blog post",
        variant: "destructive",
      });
    } else if (data) {
      const postData = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featured_image_url: data.featured_image_url || '',
        featured_image_alt: data.featured_image_alt || '',
        status: data.status as 'draft' | 'published',
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        reading_time: data.reading_time,
        categories: data.blog_post_categories?.map(bpc => bpc.category_id) || []
      };
      setPost(postData);
      setOriginalPost(postData);
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleTitleChange = (title: string) => {
    setPost(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      meta_title: title
    }));
  };

  const handleContentChange = (content: string) => {
    setPost(prev => ({
      ...prev,
      content,
      reading_time: estimateReadingTime(content)
    }));
  };

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    setPost(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, categoryId]
        : prev.categories.filter(id => id !== categoryId)
    }));
  };

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const processContentForSave = (content: string) => {
    // If content already contains HTML tags, preserve it as-is
    if (content.includes('<p>') || content.includes('<br>') || content.includes('<strong>') || content.includes('<em>') || content.includes('<u>')) {
      return content;
    }
    
    // Only process plain text content by converting line breaks to paragraph tags
    return content
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
      .join('\n\n');
  };

  const handleImageInsert = (imageUrl: string, altText: string) => {
    const imageMarkup = `<img src="${imageUrl}" alt="${altText}" style="max-width: 100%; height: auto; margin: 20px 0;" />`;
    setPost(prev => ({
      ...prev,
      content: prev.content + '\n\n' + imageMarkup
    }));
  };

  const insertFormatting = (startTag: string, endTag: string) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = post.content.substring(start, end);
    
    const formattedText = startTag + selectedText + endTag;
    const newContent = post.content.substring(0, start) + formattedText + post.content.substring(end);
    
    handleContentChange(newContent);
    
    // Restore selection after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, start + startTag.length + selectedText.length);
    }, 0);
  };

  const handleBold = () => insertFormatting('<strong>', '</strong>');
  const handleItalic = () => insertFormatting('<em>', '</em>');
  const handleUnderline = () => insertFormatting('<u>', '</u>');
  
  const handleBulletList = () => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = post.content.substring(start, end);
    
    let listMarkup;
    if (selectedText) {
      // If text is selected, convert lines to list items
      const lines = selectedText.split('\n').filter(line => line.trim());
      const listItems = lines.map(line => `  <li>${line.trim()}</li>`).join('\n');
      listMarkup = `<ul>\n${listItems}\n</ul>`;
    } else {
      // If no selection, insert empty list
      listMarkup = '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>';
    }
    
    const newContent = post.content.substring(0, start) + listMarkup + post.content.substring(end);
    handleContentChange(newContent);
    
    // Focus and position cursor
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + listMarkup.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleNumberedList = () => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = post.content.substring(start, end);
    
    let listMarkup;
    if (selectedText) {
      // If text is selected, convert lines to list items
      const lines = selectedText.split('\n').filter(line => line.trim());
      const listItems = lines.map(line => `  <li>${line.trim()}</li>`).join('\n');
      listMarkup = `<ol>\n${listItems}\n</ol>`;
    } else {
      // If no selection, insert empty list
      listMarkup = '<ol>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ol>';
    }
    
    const newContent = post.content.substring(0, start) + listMarkup + post.content.substring(end);
    handleContentChange(newContent);
    
    // Focus and position cursor
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + listMarkup.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };
  
  const handleLink = () => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = post.content.substring(start, end);
    
    const url = prompt("Enter the URL:");
    if (!url) return;
    
    const linkText = selectedText || "link text";
    const linkMarkup = `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
    const newContent = post.content.substring(0, start) + linkMarkup + post.content.substring(end);
    
    handleContentChange(newContent);
    
    // Focus and position cursor after the link
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + linkMarkup.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleEmailLink = () => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = post.content.substring(start, end);
    
    const email = prompt("Enter the email address:");
    if (!email) return;
    
    const subject = prompt("Enter the email subject (optional):") || "";
    const body = prompt("Enter the email body (optional):") || "";
    
    let mailtoUrl = `mailto:${email}`;
    const params = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    if (params.length > 0) {
      mailtoUrl += `?${params.join('&')}`;
    }
    
    const linkText = selectedText || email;
    const emailLinkMarkup = `<a href="${mailtoUrl}">${linkText}</a>`;
    const newContent = post.content.substring(0, start) + emailLinkMarkup + post.content.substring(end);
    
    handleContentChange(newContent);
    
    // Focus and position cursor after the email link
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + emailLinkMarkup.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleSave = async (newStatus?: 'draft' | 'published') => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save posts",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    
    const statusToSave = newStatus || post.status;
    const shouldSetPublishedAt = statusToSave === 'published' && (!post.id || post.status !== 'published');
    
    // Check for slug conflicts only when creating new posts or if slug has changed
    let finalSlug = post.slug;
    if (!isEditing || (isEditing && originalPost && post.slug !== originalPost.slug)) {
      // Check if slug already exists
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', post.slug)
        .neq('id', id || '')
        .single();
      
      if (existingPost) {
        // Only append timestamp if there's a conflict
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '-');
        finalSlug = `${post.slug}-${timestamp}`;
      }
    }
    
    const postData = {
      title: post.title,
      slug: finalSlug,
      excerpt: post.excerpt,
      content: processContentForSave(post.content),
      featured_image_url: post.featured_image_url || null,
      featured_image_alt: post.featured_image_alt || null,
      status: statusToSave,
      meta_title: post.meta_title || null,
      meta_description: post.meta_description || null,
      reading_time: post.reading_time,
      author_id: user.id,
      ...(shouldSetPublishedAt ? { published_at: new Date().toISOString() } : {})
    };

    try {
      let postId = post.id;

      if (isEditing) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);

        if (error) throw error;
        postId = id;
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select('id')
          .single();

        if (error) throw error;
        postId = data.id;
      }

      // Update categories
      if (postId) {
        // Delete existing categories
        await supabase
          .from('blog_post_categories')
          .delete()
          .eq('post_id', postId);

        // Insert new categories
        if (post.categories.length > 0) {
          const categoryInserts = post.categories.map(categoryId => ({
            post_id: postId,
            category_id: categoryId
          }));

          await supabase
            .from('blog_post_categories')
            .insert(categoryInserts);
        }
      }

      toast({
        title: "Success",
        description: `Post ${statusToSave === 'published' ? 'published' : 'saved'} successfully`,
      });

      if (!isEditing) {
        navigate(`/admin/blog/edit/${postId}`);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: "Failed to save blog post",
        variant: "destructive",
      });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/admin/blog')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Post' : 'New Post'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {post.status === 'published' && (
            <Button variant="outline" asChild>
              <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </a>
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => handleSave('draft')}
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button 
            onClick={() => handleSave('published')}
            disabled={saving || !post.title || !post.content}
          >
            Publish
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={post.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={post.slug}
                  onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="post-url-slug"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={post.excerpt}
                  onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the post"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                
                {/* Formatting Toolbar */}
                <div className="border border-input rounded-t-md bg-muted/20 px-3 py-2 flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleBold}
                    className="h-8 w-8 p-0"
                    title="Bold"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleItalic}
                    className="h-8 w-8 p-0"
                    title="Italic"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleUnderline}
                    className="h-8 w-8 p-0"
                    title="Underline"
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleLink}
                    className="h-8 w-8 p-0"
                    title="Add Link"
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleEmailLink}
                    className="h-8 w-8 p-0"
                    title="Add Email Link"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleBulletList}
                    className="h-8 w-8 p-0"
                    title="Bullet List"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleNumberedList}
                    className="h-8 w-8 p-0"
                    title="Numbered List"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <div className="text-xs text-muted-foreground ml-2">
                    Select text and click formatting buttons
                  </div>
                </div>
                
                <Textarea
                  ref={contentTextareaRef}
                  id="content"
                  value={post.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Write your blog post content here..."
                  rows={20}
                  className="font-mono rounded-t-none border-t-0"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Estimated reading time: {post.reading_time} minutes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={post.meta_title}
                  onChange={(e) => setPost(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="SEO title"
                />
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={post.meta_description}
                  onChange={(e) => setPost(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="SEO description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload
                currentImageUrl={post.featured_image_url}
                onImageChange={(url) => setPost(prev => ({ ...prev, featured_image_url: url || '' }))}
              />
              
              <div>
                <Label htmlFor="featured_image_alt">Image Description (Alt Text)</Label>
                <Input
                  id="featured_image_alt"
                  value={post.featured_image_alt}
                  onChange={(e) => setPost(prev => ({ ...prev, featured_image_alt: e.target.value }))}
                  placeholder="Describe the image for SEO and accessibility"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select one or more categories for this post
              </p>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No categories available</p>
              ) : (
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-3 p-2 rounded hover:bg-muted/50">
                      <Checkbox
                        id={category.id}
                        checked={post.categories.includes(category.id)}
                        onCheckedChange={(checked) => 
                          handleCategoryToggle(category.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={category.id} className="text-sm font-medium cursor-pointer flex-1">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                  
                  {/* Selected categories summary */}
                  {post.categories.length > 0 && (
                    <div className="mt-4 pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Selected categories:</p>
                      <div className="flex flex-wrap gap-1">
                        {post.categories.map(categoryId => {
                          const category = categories.find(c => c.id === categoryId);
                          return category ? (
                            <span key={categoryId} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                              {category.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;