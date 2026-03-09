import { Mail, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="px-6 md:px-12 lg:px-20 py-12 md:py-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="space-y-8">
          <div className="group">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <h3 className="text-xs uppercase tracking-wider text-gray-500">Email</h3>
            </div>
            <a
              href="mailto:tom.gunst@outlook.com"
              className="text-xs md:text-sm text-white hover:text-gray-300 transition-colors block tracking-wide"
            >
              tom.gunst@outlook.com
            </a>
          </div>

          <div className="group">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <h3 className="text-xs uppercase tracking-wider text-gray-500">Tel nr</h3>
            </div>
            <a
              href="tel:+32485363655"
              className="text-xs md:text-sm text-white hover:text-gray-300 transition-colors block tracking-wide"
            >
              +32485363655
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
