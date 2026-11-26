import { FormEvent, useEffect, useState } from 'react';

type GalleryMedia = {
  kind: 'photo' | 'video';
  src: string;
  alt?: string;
  title: string;
};

const sitePath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
const whatsappNumber = '5522999884350';
const whatsappStoryUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá, Lemoz! Quero conversar sobre a criação de uma história.')}`;

const galleryItems: GalleryMedia[] = [
  { kind: 'photo', src: sitePath('/gallery/img-0344.jpg'), alt: 'Noivos e convidados reunidos durante uma celebração', title: 'Um dia para celebrar' },
  { kind: 'video', src: sitePath('/gallery/video-01.mp4'), title: 'Filme 01' },
  { kind: 'photo', src: sitePath('/gallery/img-0343.jpg'), alt: 'Registro de uma celebração especial', title: 'Um instante especial' },
  { kind: 'video', src: sitePath('/gallery/video-02.mp4'), title: 'Filme 02' },
  { kind: 'photo', src: sitePath('/gallery/img-1104.jpg'), alt: 'Detalhes de um evento registrados pela Lemoz', title: 'Detalhes que ficam' },
  { kind: 'photo', src: sitePath('/gallery/img-1102.jpg'), alt: 'Um momento espontâneo durante o evento', title: 'Do jeito que aconteceu' },
  { kind: 'video', src: sitePath('/gallery/video-03.mp4'), title: 'Filme 03' },
  { kind: 'photo', src: sitePath('/gallery/img-1132.jpg'), alt: 'Lembrança de uma ocasião especial', title: 'Memórias para guardar' },
  { kind: 'video', src: sitePath('/gallery/video-04.mp4'), title: 'Filme 04' },
  { kind: 'photo', src: sitePath('/gallery/img-1157.jpg'), alt: 'Cena de uma celebração em família', title: 'Celebrar juntos' },
  { kind: 'photo', src: sitePath('/gallery/img-1156.jpg'), alt: 'Um registro feito durante o evento', title: 'Uma história em imagens' },
  { kind: 'photo', src: sitePath('/gallery/img-casamento.jpg'), alt: 'Casal e convidados após uma cerimônia ao ar livre', title: 'Uma nova história começa' },
];

function VideoPoster({ src, title }: { src: string; title: string }) {
  const [poster, setPoster] = useState<string | null>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const target = document.querySelector<HTMLElement>(`[data-video-poster="${src}"]`);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearViewport(true);
        observer.disconnect();
      }
    }, { rootMargin: '240px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [src]);

  useEffect(() => {
    if (!nearViewport) return;

    const video = document.createElement('video');
    let posterUrl: string | null = null;
    let canceled = false;
    const captureFrame = () => {
      if (canceled || !video.videoWidth || !video.videoHeight) return;
      const scale = Math.min(1, 960 / video.videoWidth);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      const context = canvas.getContext('2d');
      if (!context) return;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob || canceled) return;
        posterUrl = URL.createObjectURL(blob);
        setPoster(posterUrl);
        video.removeAttribute('src');
        video.load();
      }, 'image/webp', 0.78);
    };
    const seekToFrame = () => {
      video.currentTime = Number.isFinite(video.duration) ? Math.min(1.2, video.duration * 0.2) : 0;
      if (video.currentTime === 0) captureFrame();
    };

    video.muted = true;
    video.preload = 'metadata';
    video.playsInline = true;
    video.addEventListener('loadedmetadata', seekToFrame, { once: true });
    video.addEventListener('seeked', captureFrame, { once: true });
    video.src = src;
    video.load();

    return () => {
      canceled = true;
      video.pause();
      video.removeAttribute('src');
      video.load();
      if (posterUrl) URL.revokeObjectURL(posterUrl);
    };
  }, [nearViewport, src]);

  return (
    <span className="video-poster-frame" data-video-poster={src}>
      {poster && <img className="video-poster" src={poster} alt="" />}
      <span className="video-poster-shade" />
      <span className="video-play" aria-hidden="true">▶</span>
      <span className="gallery-kind">VÍDEO · ASSISTA AO FILME</span>
      <span className="gallery-zoom" aria-hidden="true">↗</span>
      <span className="sr-only">Prévia de {title}</span>
    </span>
  );
}

const storyPanels = [
  {
    image: sitePath('/assets/lemoz-04.jpg'),
    alt: 'Videomaker Lemoz registrando um evento com câmera e celular',
    eyebrow: '01 / PRESENÇA',
    heading: <>O olhar atento<br />por trás de cada <em>cena.</em></>,
    body: 'Em meio à emoção, aos encontros e aos detalhes, existe sempre uma história acontecendo. A Lemoz está ali para enxergá-la de perto.',
    service: 'VIDEOMAKER · EVENTOS',
  },
  {
    image: sitePath('/assets/lemoz-02.jpg'),
    alt: 'Videomaker Lemoz com câmera e equipamento profissional',
    eyebrow: '02 / MEMÓRIA',
    heading: <>Seu dia passa.<br />O filme <em>permanece.</em></>,
    body: 'Do primeiro gesto aos momentos que ninguém planejou, cada imagem é feita para que você possa voltar e sentir tudo outra vez.',
    service: 'FILMES · HISTÓRIAS REAIS',
  },
  {
    image: sitePath('/assets/lemoz-03.jpg'),
    alt: 'Videomaker Lemoz pronto para registrar histórias',
    eyebrow: '03 / INSTANTE',
    heading: <>Feito para sentir.<br />Feito para <em>lembrar.</em></>,
    body: 'VideoMaker e StoryMaker para eventos e sonhos que merecem ser contados com verdade, sensibilidade e intenção.',
    service: 'STORYMAKER · SEU MOMENTO',
  },
];

function App() {
  const [activeMedia, setActiveMedia] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState('');

  useEffect(() => {
    let frame = 0;
    const updateHero = () => {
      const progress = Math.min(window.scrollY / Math.max(window.innerHeight * 0.78, 1), 1);
      document.documentElement.style.setProperty('--hero-progress', progress.toFixed(3));
      document.documentElement.style.setProperty('--hero-shift', `${(progress * 42).toFixed(1)}px`);
      document.documentElement.style.setProperty('--hero-scale', (1 + progress * 0.045).toFixed(3));
      setIsScrolled(window.scrollY > 28);
      frame = 0;
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHero);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    schedule();
    return () => {
      window.removeEventListener('scroll', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const panels = [...document.querySelectorAll<HTMLElement>('.story-panel')];
    let frame = 0;

    const updateParallax = () => {
      const viewport = window.innerHeight;
      panels.forEach((panel) => {
        const bounds = panel.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > viewport) return;
        const progress = (viewport - bounds.top) / (viewport + bounds.height);
        panel.querySelector('img')?.style.setProperty('--parallax-y', `${((progress - 0.5) * 34).toFixed(1)}px`);
      });
      frame = 0;
    };

    const scheduleParallax = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };

    window.addEventListener('scroll', scheduleParallax, { passive: true });
    window.addEventListener('resize', scheduleParallax);
    scheduleParallax();
    return () => {
      window.removeEventListener('scroll', scheduleParallax);
      window.removeEventListener('resize', scheduleParallax);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (activeMedia === null) return;

    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveMedia(null);
      if (event.key === 'ArrowRight') setActiveMedia((current) => current === null ? null : (current + 1) % galleryItems.length);
      if (event.key === 'ArrowLeft') setActiveMedia((current) => current === null ? null : (current - 1 + galleryItems.length) % galleryItems.length);
    };

    document.body.classList.add('lightbox-open');
    window.addEventListener('keydown', handleKeys);
    return () => {
      document.body.classList.remove('lightbox-open');
      window.removeEventListener('keydown', handleKeys);
    };
  }, [activeMedia]);

  const sendQuote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const services = data.getAll('servicos');
    if (services.length === 0) {
      setQuoteStatus('Escolha ao menos um serviço para continuar.');
      return;
    }
    const rows: [string, FormDataEntryValue | FormDataEntryValue[] | null][] = [
      ['Nome', data.get('nome')],
      ['Contato', data.get('contato')],
      ['Serviços', services],
      ['Orientação do vídeo', data.get('orientacao')],
      ['Plataformas', data.getAll('plataformas')],
      ['Tipo de evento', data.get('evento')],
      ['Outro tipo de evento', data.get('outroEvento')],
      ['Data', data.get('data')],
      ['Horário', data.get('horario')],
      ['Duração estimada', data.get('duracao')],
      ['Local', data.get('local')],
      ['Detalhes do projeto', data.get('observacoes')],
    ];
    const details = rows
      .filter(([, value]) => Array.isArray(value) ? value.length > 0 : Boolean(value))
      .map(([label, value]) => `${label}: ${Array.isArray(value) ? value.join(', ') : value}`)
      .join('\n');
    const message = `Olá, Lemoz! Gostaria de solicitar um orçamento.\n\n${details}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    setQuoteStatus('O WhatsApp será aberto com a mensagem pronta. Revise os dados e toque em enviar.');
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <header className={`topbar ${isScrolled ? 'topbar--scrolled' : ''}`}>
        <a className="wordmark" href="#inicio" aria-label="Lemoz, início">lemoz<span>.</span></a>
        <span className="top-note">FILMES FEITOS COM PRESENÇA</span>
        <nav className="top-actions" aria-label="Navegação principal">
          <a className="gallery-link" href="#galeria">Galeria</a>
          <a className="gallery-link" href="#orcamento">Orçamento</a>
          <a className="contact-link" href="#orcamento">Vamos conversar <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <main id="inicio">
        <section className="hero" aria-labelledby="intro-title">
          <img className="hero-image" src={sitePath('/assets/lemoz-01.jpg')} alt="Videomaker Lemoz registrando um evento com câmera e celular" fetchPriority="high" />
          <div className="hero-shade" />
          <div className="hero-copy">
            <div className="intro-kicker"><span className="dot" /> FILMES FEITOS COM PRESENÇA</div>
            <h1 id="intro-title"><span>Há momentos</span><span>que merecem</span><span><em>ficar.</em></span></h1>
            <p>Filmes e histórias para guardar a beleza do que acontece uma só vez.</p>
            <a className="hero-cta" href={whatsappStoryUrl} target="_blank" rel="noreferrer">Vamos criar a sua história <span aria-hidden="true">↗</span></a>
          </div>
          <div className="hero-bottomline"><span>VIDEOMAKER <i>·</i> STORYMAKER</span><a className="scroll-cue" href="#historia"><span className="scroll-line" /> ROLE PARA CONHECER</a><span>BRASIL <b>—</b> 2026</span></div>
          <span className="hero-wordmark" aria-hidden="true">LEMOZ</span>
        </section>

        <section className="story" id="historia" aria-label="Conheça o trabalho Lemoz">
          {storyPanels.map((panel, index) => (
            <article className={`story-panel reveal ${index % 2 === 1 ? 'story-panel--reverse' : ''} ${index === 2 ? 'story-panel--third' : ''}`} key={panel.eyebrow}>
              <div className="photo-wrap"><img src={panel.image} alt={panel.alt} loading={index === 0 ? 'eager' : 'lazy'} /></div>
              <div className="story-copy">
                <span className="eyebrow">{panel.eyebrow}</span>
                <h2>{panel.heading}</h2>
                <p>{panel.body}</p>
                <span className="service">{panel.service}</span>
                {index === 2 && <a className="cta" href={whatsappStoryUrl} target="_blank" rel="noreferrer">Vamos criar essa história <span aria-hidden="true">↗</span></a>}
              </div>
            </article>
          ))}
        </section>

        <section className="gallery" id="galeria" aria-labelledby="gallery-title">
          <div className="gallery-heading">
            <div>
              <span className="eyebrow">UM POUCO DO QUE VIVEMOS</span>
              <h2 id="gallery-title">Histórias em <em>imagem.</em></h2>
            </div>
            <p>Fotografias e filmes de celebrações e momentos especiais registrados pela Lemoz.</p>
          </div>
          <div className="gallery-grid">
            {galleryItems.map((item, index) => (
              <button className={`gallery-card reveal gallery-card--${index + 1} gallery-card--${item.kind}`} type="button" key={item.src} onClick={() => setActiveMedia(index)} aria-label={`Abrir ${item.kind === 'video' ? 'vídeo' : 'foto'}: ${item.title}`}>
                <span className="gallery-art">
                  {item.kind === 'photo' ? <><img src={item.src} alt={item.alt} loading="lazy" /><span className="gallery-kind">FOTOGRAFIA · EVENTOS</span><span className="gallery-zoom" aria-hidden="true">↗</span></> : <VideoPoster src={item.src} title={item.title} />}
                </span>
                <span className="gallery-caption"><span className="gallery-placeholder">LEMOZ · {item.kind === 'video' ? 'VÍDEO' : 'FOTO'} {String(index + 1).padStart(2, '0')}</span><span className="gallery-title">{item.title}</span></span>
              </button>
            ))}
          </div>
          <p className="gallery-note">Cada imagem guarda um momento que não se repete.</p>
        </section>

        <section className="quote-section" id="orcamento" aria-labelledby="quote-title">
          <div className="quote-heading">
            <span className="eyebrow">VAMOS PLANEJAR JUNTOS</span>
            <h2 id="quote-title">Conte sobre o seu <em>momento.</em></h2>
            <p>Preencha o que já sabe. Com essas informações, a Lemoz poderá entender sua ideia e preparar um orçamento personalizado.</p>
          </div>
          <form className="quote-form" onSubmit={sendQuote}>
            <fieldset className="quote-group">
              <legend><span>01</span> Seu projeto</legend>
              <p className="form-hint">Escolha uma ou mais opções.</p>
              <div className="choice-grid choice-grid--services">
                {['Mentoria audiovisual', 'Edição de vídeo', 'VideoMaker', 'StoryMaker'].map((service) => (
                  <label className="choice" key={service}><input type="checkbox" name="servicos" value={service} /><span>{service}</span></label>
                ))}
              </div>
            </fieldset>

            <fieldset className="quote-group">
              <legend><span>02</span> Edição e entrega</legend>
              <div className="form-grid">
                <label className="field"><span>Orientação do vídeo</span><select name="orientacao" defaultValue=""><option value="">Selecione, se aplicável</option><option>Vertical</option><option>Horizontal</option><option>Ambas</option><option>Ainda não sei</option></select></label>
                <div className="field"><span>Onde pretende publicar?</span><div className="choice-row">
                  {['Instagram', 'TikTok', 'YouTube', 'Outra'].map((platform) => <label className="choice choice--compact" key={platform}><input type="checkbox" name="plataformas" value={platform} /><span>{platform}</span></label>)}
                </div></div>
              </div>
            </fieldset>

            <fieldset className="quote-group">
              <legend><span>03</span> Sobre o evento</legend>
              <div className="form-grid">
                <label className="field"><span>Tipo de evento</span><select name="evento" defaultValue=""><option value="">Selecione uma opção</option><option>Casamento</option><option>Festa</option><option>Aniversário</option><option>Evento corporativo</option><option>Outro</option></select></label>
                <label className="field"><span>Outro tipo (opcional)</span><input name="outroEvento" type="text" placeholder="Conte qual é o evento" /></label>
                <label className="field"><span>Data</span><input name="data" type="date" /></label>
                <label className="field"><span>Horário de início</span><input name="horario" type="time" /></label>
                <label className="field"><span>Duração estimada</span><select name="duracao" defaultValue=""><option value="">Selecione ou deixe em aberto</option><option>Até 2 horas</option><option>2 a 4 horas</option><option>4 a 6 horas</option><option>6 a 8 horas</option><option>Mais de 8 horas</option><option>A definir</option></select></label>
                <label className="field"><span>Local do evento</span><input name="local" type="text" placeholder="Espaço, cidade ou endereço" /></label>
              </div>
            </fieldset>

            <fieldset className="quote-group">
              <legend><span>04</span> Seus dados e detalhes</legend>
              <div className="form-grid">
                <label className="field"><span>Seu nome</span><input name="nome" type="text" autoComplete="name" placeholder="Como podemos chamar você?" required /></label>
                <label className="field"><span>E-mail ou WhatsApp</span><input name="contato" type="text" autoComplete="email" placeholder="Seu melhor contato" required /></label>
                <label className="field field--full"><span>Observações</span><textarea name="observacoes" rows={5} placeholder="Conte um pouco mais sobre o evento, a ideia ou o que você gostaria de registrar." /></label>
              </div>
            </fieldset>
            <div className="quote-submit"><button type="submit">Solicitar orçamento pelo WhatsApp <span aria-hidden="true">↗</span></button></div>
            <p className="quote-status" role="status" aria-live="polite">{quoteStatus}</p>
          </form>
        </section>
      </main>

      <footer><a className="wordmark" href="#inicio">lemoz<span>.</span></a><span>HISTÓRIAS QUE FICAM.</span><a href="#inicio">VOLTAR AO INÍCIO ↑</a></footer>

      {activeMedia !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={galleryItems[activeMedia].kind === 'video' ? 'Reprodução do vídeo' : 'Visualização da foto'} onClick={() => setActiveMedia(null)}>
          <button className="lightbox-close" type="button" aria-label="Fechar visualização" onClick={() => setActiveMedia(null)}>×</button>
          <button className="lightbox-arrow lightbox-arrow--prev" type="button" aria-label="Mídia anterior" onClick={(event) => { event.stopPropagation(); setActiveMedia((activeMedia - 1 + galleryItems.length) % galleryItems.length); }}>‹</button>
          <figure className={`lightbox-content ${galleryItems[activeMedia].kind === 'video' ? 'lightbox-content--video' : ''}`} onClick={(event) => event.stopPropagation()}>
            {galleryItems[activeMedia].kind === 'video' ? <video src={galleryItems[activeMedia].src} controls playsInline preload="metadata" /> : <img src={galleryItems[activeMedia].src} alt={galleryItems[activeMedia].alt} />}
            <figcaption>{galleryItems[activeMedia].title}<span>{String(activeMedia + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}</span></figcaption>
          </figure>
          <button className="lightbox-arrow lightbox-arrow--next" type="button" aria-label="Próxima mídia" onClick={(event) => { event.stopPropagation(); setActiveMedia((activeMedia + 1) % galleryItems.length); }}>›</button>
        </div>
      )}
    </>
  );
}

export default App;
