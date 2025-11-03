import { ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

interface NetAcadLinkButtonProps {
  url?: string;
  label?: string;
  variant?: 'default' | 'outline';
  className?: string;
}

export default function NetAcadLinkButton({
  url,
  label = 'Open in NetAcad',
  variant = 'default',
  className = ''
}: NetAcadLinkButtonProps) {
  if (!url) {
    return null;
  }

  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      className={`${
        variant === 'default'
          ? 'bg-black text-white hover:bg-gray-800'
          : 'border-black text-black hover:bg-gray-100'
      } ${className}`}
    >
      <ExternalLink className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
}
