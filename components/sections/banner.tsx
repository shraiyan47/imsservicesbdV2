import Image from 'next/image'

export default function Banner() {
  return (
    <section className="relative h-96 md:h-[500px] bg-gradient-to-r from-navy-dark to-purple-accent overflow-hidden" id="banner">
      {/* Background Image with Optimization */}
      <Image
        src="/CoverWA.png"
        alt="Students studying abroad"
        fill
        className="absolute inset-0 opacity-20 object-cover"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
        quality={75}
      />
      
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-white px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
            Your Gateway to Global Education
          </h1>
          <p className="text-lg md:text-xl text-white/90 text-balance">
            Achieve your dreams with IMS Services - Your trusted partner in international education
          </p>
        </div>
      </div>
    </section>
  )
}
