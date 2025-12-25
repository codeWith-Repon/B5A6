import { Github, Linkedin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { techStackData } from '@/data/about';

export function DeveloperShowcaseSection() {
  const techStack = techStackData;

  return (
    <div className='sticky top-24 space-y-8'>
      {/* Developer Card */}
      <div className='bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors'>
        {/* Header Background */}
        <div className='h-24 bg-gradient-to-r from-primary to-secondary' />

        {/* Content */}
        <div className='px-6 pb-6'>
          {/* Avatar */}
          <div className='flex justify-center -mt-12 mb-4'>
            <div className='w-24 h-24 rounded-full border-4 border-card bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg'>
              <span className='text-4xl font-bold'>R</span>
            </div>
          </div>

          {/* Developer Info */}
          <div className='text-center space-y-2 mb-4'>
            <h3 className='text-2xl font-bold text-foreground'>Repon</h3>
            <p className='text-sm text-primary font-semibold'>
              Full-Stack Developer
            </p>
            <p className='text-xs text-foreground/70 leading-relaxed'>
              Passionate about building scalable, user-centric applications with
              modern web technologies. Experienced in React, Next.js,
              TypeScript, and full-stack development.
            </p>
          </div>

          {/* Social Links */}
          <div className='grid grid-cols-3 gap-2 mb-6'>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center justify-center gap-1 text-xs'
              asChild
            >
              <a
                href='https://github.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Github className='w-4 h-4' />
                <span className='hidden sm:inline'>GitHub</span>
              </a>
            </Button>

            <Button
              variant='outline'
              size='sm'
              className='flex items-center justify-center gap-1 text-xs'
              asChild
            >
              <a
                href='https://linkedin.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Linkedin className='w-4 h-4' />
                <span className='hidden sm:inline'>LinkedIn</span>
              </a>
            </Button>

            <Button
              variant='outline'
              size='sm'
              className='flex items-center justify-center gap-1 text-xs'
              asChild
            >
              <a href='#' target='_blank' rel='noopener noreferrer'>
                <Globe className='w-4 h-4' />
                <span className='hidden sm:inline'>Portfolio</span>
              </a>
            </Button>
          </div>

          {/* Divider */}
          <div className='border-t border-border pt-6' />
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className='space-y-4'>
        <h3 className='text-xl font-bold text-foreground'>Tech Stack</h3>
        <div className='grid grid-cols-2 gap-3'>
          {techStack.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <div
                key={index}
                className='p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-all group'
              >
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tech.color} flex items-center justify-center text-white mb-2`}
                >
                  <Icon className='w-4 h-4' />
                </div>
                <p className='text-sm font-semibold text-foreground group-hover:text-primary transition-colors'>
                  {tech.name}
                </p>
                <p className='text-xs text-foreground/60'>{tech.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact CTA */}
      <div className='bg-primary/5 border border-primary/20 rounded-xl p-4 text-center space-y-3'>
        <p className='text-sm text-foreground/70'>
          Interested in collaboration?
        </p>
        <Button
          className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm'
          asChild
        >
          <a href='mailto:reponahmedd@gmail.com'>Get in Touch</a>
        </Button>
      </div>
    </div>
  );
}
