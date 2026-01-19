import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default user
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@portfolio.com' },
    update: {},
    create: {
      email: 'demo@portfolio.com',
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  console.log('✅ Created user:', user.email);

  // Create a sample portfolio for the user
  const portfolio = await prisma.portfolio.upsert({
    where: { slug: 'demo-portfolio' },
    update: {},
    create: {
      name: 'Demo Portfolio',
      slug: 'demo-portfolio',
      userId: user.id,
      published: true,
      theme: {
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        accentColor: '#f472b6',
        backgroundColor: '#0f172a',
        textColor: '#f8fafc',
        fontFamily: 'Inter',
        borderRadius: 'medium',
      },
      sections: [
        {
          id: 'hero-1',
          type: 'hero',
          order: 0,
          visible: true,
          data: {
            name: 'Demo User',
            title: 'Full Stack Developer',
            subtitle: 'Building amazing web experiences with modern technologies',
            avatarUrl: '',
            backgroundStyle: 'gradient',
            backgroundColor: '#0f172a',
            gradientColors: ['#6366f1', '#8b5cf6', '#d946ef'],
          },
        },
        {
          id: 'about-1',
          type: 'about',
          order: 1,
          visible: true,
          data: {
            title: 'About Me',
            description: 'I am a passionate developer with expertise in React, Node.js, and modern web technologies. I love creating beautiful and functional applications that solve real-world problems.',
            imageUrl: '',
            highlights: ['React Expert', 'Node.js Developer', 'UI/UX Enthusiast'],
          },
        },
        {
          id: 'skills-1',
          type: 'skills',
          order: 2,
          visible: true,
          data: {
            title: 'Skills & Technologies',
            subtitle: 'Technologies I work with',
            displayStyle: 'bars',
            skills: [
              { id: 'skill-1', name: 'React', level: 90, category: 'Frontend' },
              { id: 'skill-2', name: 'TypeScript', level: 85, category: 'Frontend' },
              { id: 'skill-3', name: 'Node.js', level: 80, category: 'Backend' },
              { id: 'skill-4', name: 'PostgreSQL', level: 75, category: 'Backend' },
              { id: 'skill-5', name: 'Tailwind CSS', level: 90, category: 'Frontend' },
            ],
          },
        },
        {
          id: 'projects-1',
          type: 'projects',
          order: 3,
          visible: true,
          data: {
            title: 'My Projects',
            subtitle: 'A collection of work I\'m proud of',
            layout: 'grid',
            projects: [
              {
                id: 'project-1',
                title: 'Portfolio Builder',
                description: 'A drag-and-drop portfolio builder with customizable themes',
                imageUrl: '',
                tags: ['Next.js', 'NestJS', 'PostgreSQL'],
                liveUrl: 'https://example.com',
                githubUrl: 'https://github.com',
              },
            ],
          },
        },
        {
          id: 'contact-1',
          type: 'contact',
          order: 4,
          visible: true,
          data: {
            title: 'Get In Touch',
            subtitle: 'Let\'s work together',
            email: 'demo@portfolio.com',
            phone: '+1 234 567 890',
            location: 'San Francisco, CA',
            showForm: true,
            socials: [
              { platform: 'github', url: 'https://github.com' },
              { platform: 'linkedin', url: 'https://linkedin.com' },
              { platform: 'twitter', url: 'https://twitter.com' },
            ],
          },
        },
      ],
    },
  });

  console.log('✅ Created portfolio:', portfolio.name);
  console.log('\n📧 Login credentials:');
  console.log('   Email: demo@portfolio.com');
  console.log('   Password: password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
