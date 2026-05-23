"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string;
}

export default function BlogFeedPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('published_at', { ascending: false });

        if (!error && data) setPosts(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-300 pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-xs font-mono tracking-widest text-sky-500 uppercase mb-2">Research & Insights</h1>
          <h2 className="text-4xl font-black text-white tracking-tight uppercase">MCAS Blog</h2>
          <p className="text-slate-400 mt-2 max-w-xl font-light">
            Stay updated with our latest findings, field updates, and developments in two-wheeler safety tech.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 font-mono text-sm text-slate-500 animate-pulse">
            LOADING INSIGHTS...
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-12 text-center">
            <p className="text-slate-500 text-sm font-mono uppercase tracking-wider">No blog posts found in the database yet.</p>
            <p className="text-xs text-slate-600 mt-2">Go to your Supabase Table Editor to insert your first migrated row!</p>
          </div>
        ) : (
          /* Responsive Layout Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="group bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-sky-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Aspect Ratio Block Cover image */}
                  <div className="aspect-video w-full bg-slate-950 overflow-hidden border-b border-slate-900 relative">
                    {post.cover_image ? (
                      <img 
                        src={post.cover_image} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-slate-700">
                        NO IMAGE SPECIFIED
                      </div>
                    )}
                  </div>
                  
                  {/* Text Container Content */}
                  <div className="p-6">
                    <span className="text-[10px] font-mono tracking-widest text-sky-500 block mb-2">
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                    <h3 className="text-xl font-bold text-slate-100 group-hover:text-white mb-3 line-clamp-2 leading-snug transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-sm font-light leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-sky-400 group-hover:text-sky-300 uppercase mt-4"
                  >
                    Read Article <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}