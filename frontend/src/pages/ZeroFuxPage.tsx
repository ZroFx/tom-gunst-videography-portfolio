import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function ZeroFuxPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] px-6 py-12">
      <div className="max-w-[1400px] mx-auto">
        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-12">
          What started as a childhood dream to become a YouTuber has grown over the years into multiple YouTube channels. From gaming videos and computer tutorials to my current channel "ZeroFux", where I mainly share travel videos and personal memories, without commercial pressure. It's my place to experiment creatively and fully express myself.
        </p>
        
        <div className="flex justify-center">
          <Button
            asChild
            size="lg"
            className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <a
              href="https://www.youtube.com/@ZeroFuxBE/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Open on YouTube
              <ExternalLink className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
