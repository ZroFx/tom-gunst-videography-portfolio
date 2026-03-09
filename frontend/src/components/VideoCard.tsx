import { Image as ImageIcon } from 'lucide-react';

interface VideoCardProps {
  title: string;
  thumbnailUrl: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function VideoCard({ title, thumbnailUrl, onClick, disabled = false }: VideoCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-lg bg-gray-900 ${
        disabled ? 'cursor-default' : 'cursor-pointer'
      } transition-transform duration-300 ${disabled ? '' : 'hover:scale-[1.02]'}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="aspect-video w-full overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className={`h-full w-full object-cover transition-transform duration-500 ${
              disabled ? '' : 'group-hover:scale-110'
            }`}
          />
        ) : (
          <div className="h-full w-full bg-black/50 flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-gray-600" />
          </div>
        )}
      </div>

      {!disabled && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8">
            <h3 className="text-lg font-medium text-white">{title}</h3>
          </div>
        </div>
      )}
    </div>
  );
}
