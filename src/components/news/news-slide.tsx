import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface SlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    id: string;
    title: string;
    date: string;
    image: string;
    body: string;
  };
}

export default function SlideModal({ isOpen, onClose, content }: SlideModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg overflow-hidden max-w-2xl w-full shadow-xl">
          <div className="relative">
            {content.image && (
              <img src={content.image} alt={content.title} className="w-full h-64 object-cover" />
            )}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-white p-1 rounded-full hover:bg-gray-200"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{content.date}</p>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
