import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle } from 'lucide-react';

// Form validation schema
const inquiryFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(100),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000),
});

type InquiryFormData = z.infer<typeof inquiryFormSchema>;

export function InquiryFormSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquiryFormSchema),
  });

  const onSubmit = async (data: InquiryFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Form submitted:', data);

      // Show success message
      setSubmitSuccess(true);
      reset();

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl font-bold text-foreground mb-2'>
          Send us a Message
        </h2>
        <p className='text-foreground/70'>
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-6 bg-card border border-border rounded-2xl p-8'
      >
        {/* Success Message */}
        {submitSuccess && (
          <div className='flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg'>
            <CheckCircle className='w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0' />
            <p className='text-green-700 dark:text-green-400 font-medium'>
              ✓ Message sent successfully! We'll get back to you soon.
            </p>
          </div>
        )}

        {/* Name Field */}
        <div className='space-y-2'>
          <label
            htmlFor='name'
            className='block text-sm font-semibold text-foreground'
          >
            Full Name <span className='text-primary'>*</span>
          </label>
          <input
            id='name'
            type='text'
            placeholder='John Doe'
            className='w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all'
            {...register('name')}
            disabled={isLoading}
          />
          {errors.name && (
            <p className='text-sm text-red-600 dark:text-red-400'>
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className='space-y-2'>
          <label
            htmlFor='email'
            className='block text-sm font-semibold text-foreground'
          >
            Email Address <span className='text-primary'>*</span>
          </label>
          <input
            id='email'
            type='email'
            placeholder='john@example.com'
            className='w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all'
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && (
            <p className='text-sm text-red-600 dark:text-red-400'>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Subject Field */}
        <div className='space-y-2'>
          <label
            htmlFor='subject'
            className='block text-sm font-semibold text-foreground'
          >
            Subject <span className='text-primary'>*</span>
          </label>
          <input
            id='subject'
            type='text'
            placeholder='How can we help?'
            className='w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all'
            {...register('subject')}
            disabled={isLoading}
          />
          {errors.subject && (
            <p className='text-sm text-red-600 dark:text-red-400'>
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div className='space-y-2'>
          <label
            htmlFor='message'
            className='block text-sm font-semibold text-foreground'
          >
            Message <span className='text-primary'>*</span>
          </label>
          <textarea
            id='message'
            placeholder='Tell us more about your inquiry...'
            rows={6}
            className='w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none'
            {...register('message')}
            disabled={isLoading}
          />
          {errors.message && (
            <p className='text-sm text-red-600 dark:text-red-400'>
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          disabled={isLoading}
          className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 flex items-center justify-center gap-2 cursor-pointer'
        >
          {isLoading ? (
            <>
              <div className='w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin' />
              Sending...
            </>
          ) : (
            <>
              <Send className='w-4 h-4' />
              Send Message
            </>
          )}
        </Button>

        {/* Form info */}
        <p className='text-xs text-foreground/60 text-center'>
          All fields marked with * are required. We'll respond within 24 hours.
        </p>
      </form>
    </div>
  );
}
