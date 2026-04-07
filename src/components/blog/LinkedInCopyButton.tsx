import { useState } from 'react';
import { Linkedin, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LinkedInCopyButtonProps {
  hook: string;
  url: string;
}

export default function LinkedInCopyButton({ hook, url }: LinkedInCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = `${hook}\n\nRead the full deep dive here:\n${url}`;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleCopy}
      className="flex items-center gap-2 group border-primary/20 hover:border-primary/50 transition-colors"
    >
      <Linkedin size={16} className="text-[#0A66C2] group-hover:scale-110 transition-transform" />
      <span>{copied ? 'Copied!' : 'Copy to Share on LinkedIn'}</span>
      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={14} className="text-muted-foreground" />}
    </Button>
  );
}
