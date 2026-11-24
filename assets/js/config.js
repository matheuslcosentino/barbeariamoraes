/* ==========================================================================
   BARBEARIA MORAES — CONFIGURAÇÃO CENTRAL
   Fontes (conferidas em 24/11/2026):
   • Instagram @barbeariamoraes (bio: serviços, ordem de chegada, horários, telefone; fotos)
   • Perfil da Empresa no Google "Moraes Barbearia" (endereço, nota, avaliações)
   Campos null ou listas vazias ficam ocultos.
   ========================================================================== */
window.SITE_CONFIG = {
  business: {
    name: 'Barbearia Moraes',
    short: 'Moraes',
    services: 'Barba, cabelo e sobrancelha',
    walkIn: true, // "Ordem de chegada" (bio do Instagram)
  },

  contact: {
    phone: { number: '+5547996454658', display: '(47) 99645-4658' },
    // O número é celular. Confirme com a barbearia se ele atende WhatsApp;
    // se não atender, troque para null e o botão some.
    whatsapp: { number: '5547996454658', display: '(47) 99645-4658' },
    instagram: { handle: '@barbeariamoraes', url: 'https://www.instagram.com/barbeariamoraes' },
  },

  messages: {
    general: 'Olá! Vim pelo site da Barbearia Moraes e gostaria de tirar uma dúvida.',
  },

  address: {
    street: 'Rua 200, 118',
    complement: 'Salas 01 e 02 · esquina com a 3ª Avenida',
    district: 'Centro',
    city: 'Balneário Camboriú',
    state: 'SC',
    zip: '88330-084',
    geo: { lat: -26.9888046, lng: -48.6397052 },
    mapsQuery: 'Moraes Barbearia, Rua 200, 118 - Centro, Balneário Camboriú - SC',
  },

  // days: 0 = domingo … 6 = sábado (bio do Instagram, igual ao Google)
  hours: [
    { label: 'Segunda a sexta', days: [1, 2, 3, 4, 5], open: '08:30', close: '20:00' },
    { label: 'Sábado', days: [6], open: '08:30', close: '18:00' },
    { label: 'Domingo', days: [0], closed: true },
  ],
  hoursNote: 'Atendimento por ordem de chegada. Horários podem mudar em feriados.',

  rating: { value: '4,8', count: 454, source: 'Google', checkedAt: 'novembro de 2026' },

  services: [
    { name: 'Cabelo', text: 'Cortes clássicos e modernos, do social ao degradê, na tesoura ou na máquina.', icon: 'scissors' },
    { name: 'Barba', text: 'Desenho, aparo e acabamento para manter a barba alinhada, curta ou cheia.', icon: 'razor' },
    { name: 'Sobrancelha', text: 'Acabamento da sobrancelha para fechar o visual com precisão.', icon: 'brow' },
  ],

  // Fotos publicadas no Instagram da barbearia (assets/img/cortes/)
  gallery: [
    { src: 'assets/img/cortes/corte-01', alt: 'Cliente com corte social e barba aparada' },
    { src: 'assets/img/cortes/corte-02', alt: 'Cliente com degradê baixo e barba cheia' },
    { src: 'assets/img/cortes/corte-03', alt: 'Cliente sorrindo após corte e barba' },
    { src: 'assets/img/cortes/corte-04', alt: 'Dois clientes com cabelos cacheados após o atendimento' },
    { src: 'assets/img/cortes/corte-05', alt: 'Perfil de cliente com degradê e topete' },
    { src: 'assets/img/cortes/corte-06', alt: 'Cliente de terno com barba desenhada' },
    { src: 'assets/img/cortes/corte-07', alt: 'Cliente com corte curto e acabamento na nuca' },
    { src: 'assets/img/cortes/corte-08', alt: 'Cliente com barba longa e cabelo comprido' },
    { src: 'assets/img/cortes/corte-09', alt: 'Cliente de perfil após corte e barba' },
    { src: 'assets/img/cortes/corte-10', alt: 'Cliente tatuado na cadeira da barbearia' },
  ],

  steps: [
    { title: 'Confira se está aberto', text: 'O status no topo do site mostra na hora se a barbearia está aberta.' },
    { title: 'Venha até a barbearia', text: 'Rua 200, 118, esquina com a 3ª Avenida, no Centro.' },
    { title: 'Sente que é a sua vez', text: 'O atendimento é por ordem de chegada, sem precisar agendar.' },
  ],

  // Trechos reais de avaliações públicas no Google (nomes abreviados)
  reviews: {
    enabled: true,
    tags: ['preço', 'ambiente', 'educados'],
    items: [
      { author: 'Avaliação no Google', text: 'Lugar legal, barbearia sem frescura, bons profissionais e preços justos.' },
      { author: 'Avaliação no Google', text: 'Pessoal gente boa. Ambiente alto astral. Preços justos com serviço de qualidade.' },
      { author: 'Andrés P.', text: 'Sensacional, atendimento de primeira […]. Recomendo a todos, a melhor barbearia de Balneário Camboriú.' },
    ],
  },

  faq: [
    { q: 'Precisa agendar horário?', a: 'Não. O atendimento é por ordem de chegada: é só vir dentro do horário de funcionamento.' },
    { q: 'Qual o horário de funcionamento?', a: '{horarios}' },
    { q: 'Onde fica a barbearia?', a: 'Na {endereco}. Use o botão “Como chegar” para abrir a rota no Google Maps.' },
    { q: 'Quais serviços vocês fazem?', a: 'Cabelo, barba e sobrancelha.' },
    { q: 'Como falo com a barbearia?', a: 'Pelo telefone {telefone} ou pelo Instagram {instagram}.' },
  ],
};
