import { confirmado, opcional } from './tipos.ts';

const FONTE_GOOGLE = 'ficha do Google (coletada em 04/11/2026)';

const geo = { lat: -27.8013201, lng: -50.3148959 } as const;
const endereco = {
  logradouro: 'Av. Duque de Caxias',
  numero: '1253',
  bairro: 'Frei Rogério',
  cidade: 'Lages',
  uf: 'SC',
  cep: '88508-001',
  pais: 'BR',
  completo: 'Av. Duque de Caxias, 1253, Frei Rogério, Lages/SC, CEP 88508-001',
} as const;

export const contato = {
  /** só dígitos, com DDI: é o que vai no wa.me */
  whatsapp: confirmado('5549998043861', 'João + telefone da ficha do Google'),
  telefone: confirmado('(49) 99804-3861', FONTE_GOOGLE),
  telefoneE164: confirmado('+5549998043861', FONTE_GOOGLE),
  instagram: confirmado(
    { usuario: 'primehouse.academia', url: 'https://www.instagram.com/primehouse.academia/' },
    'perfil oficial',
  ),
  endereco: confirmado(endereco, 'bio do Instagram + ficha do Google'),
  geo: confirmado(geo, FONTE_GOOGLE),
  plusCode: confirmado('5MXP+F2 Lages, SC', FONTE_GOOGLE),
  mapas: confirmado(
    {
      google: 'https://www.google.com/maps?cid=9561389130144054445',
      waze: `https://waze.com/ul?ll=${geo.lat},${geo.lng}&navigate=yes`,
      apple: `https://maps.apple.com/?ll=${geo.lat},${geo.lng}&q=${encodeURIComponent('Prime House Academia')}&address=${encodeURIComponent(endereco.completo)}`,
    },
    FONTE_GOOGLE,
  ),
  estacionamento: opcional<string>(),
  acessibilidade: opcional<string>(),
} as const;
