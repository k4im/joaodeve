import { useEffect, useRef, useState } from 'react';
import './App.css'
import { useTranslation } from 'react-i18next';
import Lenis from '@studio-freight/lenis';
import imagemSrc from './assets/imagem.jpg';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LoadingBar from 'react-top-loading-bar';
import ScrollVelocity from './components/ScrollVelocity';

function App() {
  const { t, i18n } = useTranslation();
  gsap.registerPlugin(useGSAP);
  const container = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isHeroInFocus, setIsHeroInFocus] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      const aboutSection = document.getElementById('about');
      const experienceSection = document.getElementById('experience');
      const scrollVelocity = document.getElementById('scroll-velocity');

      if (!heroSection || !aboutSection || !experienceSection) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;

      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      const footerTop = experienceSection.offsetTop;
      const scrollVelocityTop = scrollVelocity ? scrollVelocity.offsetTop : 0;
      // Detectar se hero está em foco
      const heroInFocus = scrollTop <= heroBottom - windowHeight / 3;

      // Se mudou o estado do foco da hero section
      if (heroInFocus !== isHeroInFocus) {
        setIsHeroInFocus(heroInFocus);

        if (!heroInFocus) {
          // Hero saiu de foco - elementos sobem e desaparecem
          gsap.to('#hero-title', { y: -100, opacity: 0, duration: 0.8, ease: 'power2.in' });
          gsap.to('#hero-sub', { y: -100, opacity: 0, duration: 0.8, ease: 'power2.in', delay: 0.1 });
          gsap.to('.five-pointed-star', { y: -100, opacity: 0, duration: 0.8, ease: 'power2.in', delay: 0.2 });
          gsap.to('#hero-seta', { y: -100, opacity: 0, duration: 0.8, ease: 'power2.in', delay: 0.3 });
          gsap.to('#hero-scroll', { opacity: 0, duration: 0.5, ease: 'power2.in' });
          gsap.to('.hero-nav-link', { y: -50, opacity: 0, duration: 0.6, ease: 'power2.in' });
          gsap.to('.i18n', { y: -50, opacity: 0, duration: 0.6, ease: 'power2.in' });
        } else {
          // Hero voltou ao foco - elementos descem e aparecem
          gsap.to('#hero-title', { y: 0, opacity: 1, duration: 1, ease: 'power2.out' });
          gsap.to('#hero-sub', { y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.1 });
          gsap.to('.five-pointed-star', { y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.2 });
          gsap.to('#hero-seta', { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out', delay: 0.3 });
          gsap.to('#hero-scroll', { opacity: 1, duration: 1, ease: 'power2.out', delay: 0.4 });
          gsap.to('.hero-nav-link', { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });
          gsap.to('.i18n', { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });
        }
      }

      // Hero section - 5% (quando está no topo ou ainda na hero section)
      if (scrollTop <= heroBottom - windowHeight / 3) {
        setProgress(5);
      }
      // About section - 50%
      else if (scrollTop >= heroBottom - windowHeight / 3 && scrollTop < footerTop - windowHeight / 2) {
        setProgress(50);
      }
      else if (scrollTop >= footerTop - windowHeight / 2) {
        setProgress(99);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Inicializar
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHeroInFocus]);

  useGSAP(() => {
    // Animações iniciais quando a página carrega
    gsap.fromTo('#hero-title', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 3, ease: 'power2.out' });
    gsap.fromTo('#hero-sub', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 3, ease: 'power2.out' });
    gsap.fromTo('.five-pointed-star', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 3, ease: 'power2.out' });
    gsap.fromTo('#hero-seta', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 8, ease: 'power2.out' });
    gsap.fromTo('#hero-scroll', { opacity: 0 }, { opacity: 1, duration: 8, ease: 'power2.out' });
    gsap.fromTo('.hero-nav-link', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 3, ease: 'power2.out' });
    gsap.fromTo('.i18n', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 3, ease: 'power2.out' });
  }, { scope: container });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8, // Reduzir sensibilidade
      touchMultiplier: 0.8,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chars = entry.target.querySelectorAll('.char');
            const charsDesc = entry.target.querySelectorAll('.char-desc');

            if (chars.length > 0 && !entry.target.classList.contains('animated')) {
              // Animar cada caractere do título
              gsap.fromTo(chars,
                {
                  color: 'transparent',
                  y: 30,
                  opacity: 0
                },
                {
                  color: '#ffffff',
                  y: 0,
                  opacity: 1,
                  duration: 0.6,
                  stagger: 0.03,
                  ease: 'power2.out'
                }

              );
              gsap.fromTo('.image-container', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 1, stagger: 0.03 });
              gsap.fromTo('#about-icons', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 1, stagger: 0.03 });
              // Animar cada caractere da descrição com delay
              if (charsDesc.length > 0) {
                gsap.fromTo(charsDesc,
                  {
                    color: 'transparent',
                    y: 20,
                    opacity: 0
                  },
                  {
                    color: '#ffffff',
                    y: 0,
                    opacity: 1,
                    duration: 0.4,
                    stagger: 0.01,
                    ease: 'power2.out',
                    delay: 1 // Delay para começar após o título
                  }
                );
              }

              entry.target.classList.add('animated');
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      observer.observe(aboutSection);
    }

    return () => {
      if (aboutSection) {
        observer.unobserve(aboutSection);
      }
    };
  }, [t]);

  useEffect(() => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      // Remover a classe 'animated' para permitir nova animação
      aboutSection.classList.remove('animated');

      // Resetar todos os caracteres para o estado inicial
      const chars = aboutSection.querySelectorAll('.char');
      const charsDesc = aboutSection.querySelectorAll('.char-desc');

      gsap.set(chars, {
        color: 'transparent',
        y: 30,
        opacity: 0
      });

      gsap.set(charsDesc, {
        color: 'transparent',
        y: 20,
        opacity: 0
      });

      // Resetar image-container e about-icons
      gsap.set('.image-container', {
        y: 100,
        opacity: 0
      });

      gsap.set('#about-icons', {
        y: 100,
        opacity: 0
      });
    }
  }, [i18n.language]); // Executar quando o idioma mudar

  return (
    <main ref={container}>
      {!isMobile && (<LoadingBar
        color="#8bfd8b"
        progress={progress}
        height={2}
        onLoaderFinished={() => setProgress(0)}
      />)}

      <section id='hero' className='hero' >
        <div className='i18n'>
          <p
            style={{
              fontWeight: i18n.language === 'pt' ? 700 : 400,
              fontSize: '2rem',
              cursor: 'pointer'
            }}
            onClick={() => changeLanguage('pt')}
          >
            PT
          </p>
          <p style={{ fontSize: '2rem' }}>/</p>
          <p
            style={{
              fontWeight: i18n.language === 'en' ? 700 : 400,
              fontSize: '2rem',
              cursor: 'pointer'
            }}
            onClick={() => changeLanguage('en')}
          >
            EN
          </p>
        </div>

        <div className='hero-header'>
          <nav>
            <ul className='nav' style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className='hero-nav-link'><a href="#home">{t('fullstack.nav.home')}</a></li>
              <li className='hero-nav-link'><a href="#about">{t('fullstack.nav.about')}</a></li>
              <li className='hero-nav-link'><a href="#contact">{t('fullstack.nav.contact')}</a></li>
              <li className='hero-nav-link'><a target='_blank' href="https://drive.google.com/file/d/1bGw8fCkz09EDdIt6gTFETTSYMhzlBPy9/view?usp=sharing" style={{ color: "#8bfd8b" }}>DOWNLOAD CV</a></li>
            </ul>
          </nav>
        </div>

        <main className='hero'>
          <div className="five-pointed-star"></div>
          <h1 id='hero-title'>{t('fullstack.hero')}</h1>
          <p id='hero-sub'>{t('fullstack.hero.description')}</p>
          <div id='hero-seta' className="seta">
            <div className="flash"></div>
            <div className="chevron"></div>
          </div>
          <p id='hero-scroll' className='subtitle-scroll' style={{ textAlign: 'center' }}>scroll</p>
        </main>

      </section>

      <section id='about'>
        <div className="container">

          <div className="text-container">
            <p style={{ fontWeight: 'bold' }} className="reveal-title">
              {t('fullstack.about.title').split('').map((char, index) => (
                <span key={index} className="char">
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </p>
            <p className='description-about reveal-description'>
              {t('fullstack.about.description').split(' ').map((word, wordIndex) => (
                <span key={wordIndex} className="word">
                  {word.split('').map((char, charIndex) => (
                    <span key={`${wordIndex}-${charIndex}`} className="char-desc">
                      {char}
                    </span>
                  ))}
                  {wordIndex < t('fullstack.about.description').split(' ').length - 1 && ' '}
                </span>
              ))}
            </p>

            <div id='about-icons' className="icons">
              <div className="linkedin">
                <a href="https://www.linkedin.com/in/joao-victor-santos-leite/" target='_blank'>
                  <svg id='linkedin' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" color='#fff' stroke='#fff' fill='#fff'>
                    <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                  </svg>
                </a>
              </div>
              <div className="github">
                <a href='https://github.com/k4im' target='_blank'>
                  <svg id='github' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill='#fff'>
                    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="image-container">
            <div className="image" style={{ backgroundImage: `url(${imagemSrc})` }}>
            </div>
          </div>

        </div>
      </section>

      <section id='experience'>
        <div className="container">
          <div className="container-xp">
            <div className="xp-content">
              <div className="circle-xp active-xp">
                <p style={{ marginLeft: '4rem', marginTop: '.2rem', fontSize: '2rem', fontWeight: 700 }}>Bizzup</p>
              </div>
              <div className='slash'>
                <p className='xp-description' style={{ marginLeft: '2rem', marginTop: '3rem', fontSize: '2rem', position: 'absolute', width: '80rem' }}>{t('experience.description.bizzup')}</p>
              </div>
            </div>
            <div className="xp-content">
              <div className="circle-xp">
                <p style={{ marginLeft: '4rem', marginTop: '.2rem', fontSize: '2rem', fontWeight: 700 }}>NDD</p>
                <p style={{ fontSize: '2rem', marginTop: '.2rem', fontWeight: 700 }}>Tech</p>
              </div>
              <div className='slash'>
                <p className='xp-description' style={{ marginLeft: '2rem', marginTop: '3rem', fontSize: '2rem', position: 'absolute', width: '80rem' }}>{t('experience.description.ndd')}</p>
              </div>
            </div>
            <div className="xp-content">
              <div className="circle-xp">
                <p style={{ marginLeft: '4rem', marginTop: '.2rem', fontSize: '2rem', fontWeight: 700 }}>Platon</p>
              </div>
              <div className='slash'>
                <p className='xp-description' style={{ marginLeft: '2rem', marginTop: '3rem', fontSize: '2rem', position: 'absolute', width: '80rem' }}>{t('experience.description.platon')}</p>
              </div>
            </div>
            <div className="xp-content">
              <div className="circle-xp last-xp">
                <p style={{ marginLeft: '4rem', marginTop: '.2rem', fontSize: '2rem', fontWeight: 700 }}>Platon</p>
                <p style={{ marginTop: '.2rem', fontSize: '2rem', fontWeight: 700 }}>Infra</p>
              </div>
              <div className='slash last-xp'>
                <p className='xp-description' style={{ marginLeft: '2rem', marginTop: '3rem', fontSize: '2rem', position: 'absolute', width: '80rem' }}>{t('experience.description.platon.2')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!isMobile && (
        <ScrollVelocity
          texts={['Clean Code', 'Good Code']}
          velocity={5}
          numCopies={30}
          stiffness={100}
          className="custom-scroll-text"
        />
      )}

      <footer id='contact' style={{ border: '1px solid #fff' }}>
        <div className="container">
          <div className="left-footer">
            <h1>{t('footer.left.title.1')}</h1>
            <h1>{t('footer.left.title.2')}</h1>
          </div>
          <div className="copy">
            <p id='copy-text'>
              &copy; {new Date().getFullYear()} João Victor dos Santos Leite.
            </p>
          </div>
          <div className="right-footer">
            <h1>{t('footer.right.text')}</h1>
            <a href="mailto:contato.vitorsantos@hotmail.com" style={{ fontSize: '2rem' }}>contato.vitorsantos@hotmail.com</a>

            <div className="icons" style={{ marginLeft: '.5rem' }}>
              <div className="linkedin">
                <a href="https://www.linkedin.com/in/joao-victor-santos-leite/" target='_blank'>
                  <svg id='linkedin' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" color='#fff' stroke='#fff' fill='#fff'>
                    <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                  </svg>
                </a>
              </div>
              <div className="github">
                <a href='https://github.com/k4im' target='_blank'>
                  <svg id='github' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill='#fff'>
                    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}

export default App
