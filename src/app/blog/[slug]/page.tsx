"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface BlogPost {
  title: string;
  content: string;
  cover_image: string;
  published_at: string;
}

export default function SinglePostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!params?.slug) return;
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', params.slug)
          .single();

        if (!error && data) setPost(data);
      } catch (err) {
        console.error("Error reading post details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b12] flex items-center justify-center font-mono text-xs text-slate-500 animate-pulse">
        COMPILING RICH MEDIA BLOCKS...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#070b12] text-slate-400 flex flex-col items-center justify-center p-6 text-center">
        <p className="font-mono text-sm uppercase mb-4 text-amber-500">404 • Article Profile Not Found</p>
        <Link href="/blog" className="text-xs font-bold uppercase text-sky-400 tracking-wider hover:underline">
          ← Return to Blog Index
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#070b12] text-slate-300 pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Link */}
        <div className="mb-10">
          <Link href="/blog" className="text-xs font-bold tracking-wider uppercase text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-2">
            ← Back to Insights Feed
          </Link>
        </div>

        {/* Article Metadata Header */}
        <header className="mb-12">
          <span className="text-xs font-mono text-sky-500 block mb-3">
            Published on {new Date(post.published_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-tight">
            {post.title}
          </h1>
          <div className="h-1 w-16 bg-sky-500 mt-6 rounded-full" />
        </header>

        {/* Master Top Header Banner Image */}
        {post.cover_image && (
          <div className="my-10 bg-slate-950 p-2 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={post.cover_image} 
              alt="" 
              className="w-full h-auto max-h-[420px] object-cover rounded-xl"
            />
          </div>
        )}

        {/* High-End Rich Media Markdown Layout Parser Rendering Engine */}
        <div className="prose prose-invert max-w-none text-slate-300 font-light text-base md:text-lg space-y-6 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              // Make sure images embedded inside markdown text render with nice borders
              img: ({ ...props }) => (
                <span className="block my-8 bg-slate-950 p-2 border border-slate-900 rounded-xl overflow-hidden shadow-xl">
                  <img {...props} className="w-full h-auto rounded-lg object-cover mx-auto" alt={props.alt || "Blog graphic"} />
                </span>
              ),
              // Ensure formula container overflow handles small mobile screens gracefully
              div: ({ ...props }) => (
                <span className="block overflow-x-auto my-6 py-2 text-center text-white" {...props} />
              )
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

      </div>
    </article>
  );
}