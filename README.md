# Barbearia Moraes — Landing page

Site estático (HTML + CSS + JS, sem build) da Barbearia Moraes, no Centro de Balneário Camboriú – SC.
Bibliotecas via CDN: GSAP 3.13 + ScrollTrigger, Lenis 1.3 e Three.js r170 (poste de barbeiro 3D).

## Visualizar

Dê dois cliques em `index.html`, ou rode o comando abaixo e acesse `http://localhost:5530`.

```bash
python -m http.server 5530
```

Para ver com animações num PC que está com "efeitos de animação" desligados, use `index.html?animacoes=on`.

## Editar

Os dados ficam em `assets/js/config.js`: contato, endereço, horários, nota, serviços, fotos, avaliações e FAQ.
O status "Aberto agora / Fechado · abre às…" é calculado sozinho pelos horários, no fuso de Brasília.

## Fontes (conferidas em 24/11/2026)

- **Instagram @barbeariamoraes:** serviços (barba, cabelo e sobrancelha), "ordem de chegada", horários, telefone, logo e as fotos dos cortes.
- **Google "Moraes Barbearia":** endereço (Rua 200, 118, salas 01 e 02, esquina com a 3ª Avenida), nota 4,8 com 454 avaliações e trechos de avaliações.

## Antes de publicar

1. Domínio atual: `https://barbeariamoraes.vercel.app`. Se mudar, troque em `index.html`, `robots.txt` e `sitemap.xml`.
2. Confirme se o (47) 99645-4658 atende WhatsApp. Se não atender, use `whatsapp: null` no config.
3. O logo disponível tinha só 150 px. Um arquivo do logo em alta resolução (PNG ou SVG) melhora o topo e o rodapé.
4. Atualize a nota do Google em `rating` de tempos em tempos.

Envie tudo para a hospedagem, exceto `_originais/` e `.claude/`.
