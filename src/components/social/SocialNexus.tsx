import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Sparkles,
  Send,
  Image as ImageIcon,
  User,
  Star,
  Shield,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Post {
  id: string;
  author: {
    name: string;
    tier: 'citizen' | 'architect' | 'guardian' | 'celestial';
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  resonance: number;
  comments: number;
  hasResonated: boolean;
}

const tierIcons = {
  citizen: User,
  architect: Star,
  guardian: Shield,
  celestial: Crown,
};

const tierColors = {
  citizen: 'bg-muted text-muted-foreground',
  architect: 'bg-electric/20 text-electric',
  guardian: 'bg-isabella/20 text-isabella',
  celestial: 'bg-accent/20 text-accent',
};

const mockPosts: Post[] = [
  {
    id: '1',
    author: { name: 'Oracle Maya', tier: 'celestial' },
    content: 'Acabo de completar mi primer DreamSpace™ con shaders de obsidiana ancestral. ¡La integración de KAOS 3D™ es impresionante! 🌌✨',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    resonance: 47,
    comments: 8,
    hasResonated: false,
  },
  {
    id: '2',
    author: { name: 'Guardian Tzolkin', tier: 'guardian' },
    content: 'Isabella AI me ayudó a resolver un conflicto de gobernanza de manera ética. El sistema de Sentencia Digital realmente funciona. La tecnología al servicio de la justicia.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    resonance: 123,
    comments: 24,
    hasResonated: true,
  },
  {
    id: '3',
    author: { name: 'Architect Nexus', tier: 'architect' },
    content: 'Nueva actualización del motor Quantum-Split: ahora el 75% va directamente al creador. ¡TAMV sigue priorizando la soberanía del artista! 🚀',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    resonance: 89,
    comments: 15,
    hasResonated: false,
  },
];

const SocialNexus = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleResonance = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            resonance: post.hasResonated ? post.resonance - 1 : post.resonance + 1,
            hasResonated: !post.hasResonated 
          }
        : post
    ));
  };

  const handlePost = async () => {
    if (!newPostContent.trim()) return;
    setIsPosting(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPost: Post = {
      id: crypto.randomUUID(),
      author: { name: 'Explorador TAMV', tier: 'architect' },
      content: newPostContent,
      timestamp: new Date(),
      resonance: 0,
      comments: 0,
      hasResonated: false,
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setIsPosting(false);
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4"
      >
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-isabella flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="¿Qué está pasando en tu DreamSpace?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[80px] bg-muted/50 border-muted resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button className="text-muted-foreground hover:text-electric transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="text-muted-foreground hover:text-isabella transition-colors">
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
              <Button 
                onClick={handlePost}
                disabled={!newPostContent.trim() || isPosting}
                className="bg-gradient-primary text-primary-foreground"
              >
                <Send className="w-4 h-4 mr-2" />
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feed */}
      <AnimatePresence mode="popLayout">
        {posts.map((post, index) => {
          const TierIcon = tierIcons[post.author.tier];
          
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-2xl p-4"
            >
              {/* Author Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tierColors[post.author.tier]}`}>
                  <TierIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{post.author.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${tierColors[post.author.tier]}`}>
                      {post.author.tier.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatTime(post.timestamp)}</span>
                </div>
              </div>

              {/* Content */}
              <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

              {/* Actions */}
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => handleResonance(post.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    post.hasResonated ? 'text-isabella' : 'text-muted-foreground hover:text-isabella'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${post.hasResonated ? 'fill-current' : ''}`} />
                  <span className="text-sm">{post.resonance}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-electric transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-dream transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default SocialNexus;
