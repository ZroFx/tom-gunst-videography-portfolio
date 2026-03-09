import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="px-6 md:px-12 lg:px-20 py-8 border-t border-gray-900">
      <div className="max-w-[1400px] mx-auto">
        <p className="text-sm text-gray-500 text-center">
          © 2025. Built with{' '}
          <Heart className="inline-block w-4 h-4 text-red-500 fill-red-500 mx-1" /> using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
