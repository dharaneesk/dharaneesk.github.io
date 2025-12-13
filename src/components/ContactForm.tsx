import { useState } from 'react';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [result, setResult] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult('Sending....');

    // Create FormData object
    const submitFormData = new FormData();
    
    // Add form fields to FormData
    submitFormData.append('name', formData.name);
    submitFormData.append('email', formData.email);
    submitFormData.append('subject', formData.subject);
    submitFormData.append('message', formData.message);
    
    // Add your Web3Forms access key
    // This is a public key and can be used in frontend without issues.
    submitFormData.append('access_key', 'e2c25ff8-50c4-433d-a359-9d366714066f');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: submitFormData
      });

      const data = await response.json();

      if (data.success) {
        setResult('Form Submitted Successfully');
        toast({
          title: 'Message sent!',
          description: 'Thanks for reaching out. I\'ll get back to you soon.',
        });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        console.log('Error', data);
        setResult(data.message);
        toast({
          title: 'Error',
          description: data.message || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setResult('Failed to submit form');
      toast({
        title: 'Error',
        description: 'Failed to connect to the server. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-xl p-6 bg-gradient-to-br from-accent/5 to-primary/5">
      <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="bg-background/50"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className="bg-background/50"
          />
        </div>
      </div>
      
      <div className="mb-4 space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          placeholder="What's this about?"
          className="bg-background/50"
        />
      </div>
      
      <div className="mb-6 space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message here..."
          className="bg-background/50 resize-none"
        />
      </div>
      
      {result && (
        <div className="mb-4 text-sm font-medium">
          <p className={result.includes('Success') ? "text-green-500" : "text-red-500"}>
            {result}
          </p>
        </div>
      )}
      
      <div className="text-right">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70 ml-auto"
        >
          {isSubmitting ? 'Sending...' : (
            <>
              <Send size={16} />
              <span>Send Message</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}