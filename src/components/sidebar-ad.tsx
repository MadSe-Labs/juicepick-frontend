import Image from 'next/image';

interface SidebarAdProps {
  position: 'left' | 'right';
}

export default function SidebarAd({ position }: SidebarAdProps) {
  return (
    <div className='bg-card rounded-lg shadow overflow-hidden'>
      <div className='relative aspect-[4/5]'>
        <Image
          src={`/placeholder.svg?height=400&width=320&text=광고${
            position === 'left' ? '1' : '2'
          }`}
          alt='광고 배너'
          fill
          className='object-cover'
        />
      </div>
      <div className='p-2 text-xs text-muted-foreground text-center'>
        sponsored
      </div>
    </div>
  );
}
