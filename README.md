# LEMOZ — filmes feitos com presença

Uma experiência visual para uma marca que transforma eventos e momentos especiais em histórias para guardar. O site combina fotografia, movimento e uma apresentação minimalista dos serviços da Lemoz.

## O projeto

- Hero cinematográfico com imagem em destaque, parallax e entrada animada.
- Apresentação da história e do trabalho em painéis com imagens e movimento suave.
- Galeria de fotos e vídeos com visualização ampliada.
- Formulário de orçamento para mentoria audiovisual, edição de vídeo, VideoMaker e StoryMaker.
- Campos para orientação do vídeo, plataformas, dados do evento, contato e observações.
- Layout responsivo com suporte a preferência por movimento reduzido.

## Tecnologias

React · TypeScript · Vite · Sass

## Começar

Requer Node.js e npm instalados.

```bash
npm install
npm run dev
```

O Vite exibirá no terminal o endereço local para abrir no navegador.

## Build de produção

```bash
npm run build
npm run preview
```

Os arquivos prontos para publicação são gerados em `dist/`.

## Conteúdo da galeria

As mídias ficam em `public/gallery/`. Para adicionar um trabalho, coloque a foto ou o vídeo nessa pasta e inclua o caminho e o título correspondente na lista `galleryItems`, em `src/App.tsx`.

Fotos usam os formatos suportados pelo navegador, como JPEG, PNG ou WebP. Para vídeos, prefira MP4 com vídeo H.264 e áudio AAC para maior compatibilidade.

## Orçamentos

O formulário reúne as respostas e abre o WhatsApp da Lemoz (`+55 22 99988-4350`) com a mensagem pronta. O visitante pode revisar e enviar a solicitação pelo WhatsApp.

---

**LEMOZ** · Histórias que ficam.
