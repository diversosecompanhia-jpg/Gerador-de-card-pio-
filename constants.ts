
import { MenuItem, MenuTheme } from './types';

export const THEME_EXAMPLES: Record<MenuTheme, MenuItem[]> = {
  [MenuTheme.SWEETS]: [
    {
      id: 's1',
      name: 'Brigadeiro Gourmet Belga',
      description: 'Feito com o mais puro chocolate belga, granulado de alta qualidade e uma cremosidade inesquecível.',
      price: 'R$ 4,50',
      imageUrl: 'https://picsum.photos/seed/brigadeiro/1080/1080'
    },
    {
      id: 's2',
      name: 'Bolo de Pote Ninho com Nutella',
      description: 'Camadas generosas de creme de leite Ninho artesanal intercaladas com Nutella original.',
      price: 'R$ 15,00',
      imageUrl: 'https://picsum.photos/seed/ninho/1080/1080'
    },
    {
      id: 's3',
      name: 'Brownie de Chocolate Intenso',
      description: 'Massa úmida e densa com pedaços de nozes crocantes e cobertura de ganache de chocolate 70%.',
      price: 'R$ 12,00',
      imageUrl: 'https://picsum.photos/seed/brownie/1080/1080'
    }
  ],
  [MenuTheme.SAVORIES]: [
    {
      id: 'sa1',
      name: 'Coxinha de Frango com Catupiry',
      description: 'Massa de batata leve e crocante, recheio suculento de frango desfiado com o verdadeiro Catupiry.',
      price: 'R$ 8,50',
      imageUrl: 'https://picsum.photos/seed/coxinha/1080/1080'
    },
    {
      id: 'sa2',
      name: 'Empada de Palmito Cremosa',
      description: 'Massa podre que derrete na boca com recheio de palmito selecionado e molho branco especial.',
      price: 'R$ 7,50',
      imageUrl: 'https://picsum.photos/seed/empada/1080/1080'
    },
    {
      id: 'sa3',
      name: 'Quibe Assado Recheado',
      description: 'Carne bovina de primeira temperada com hortelã fresca e recheada com queijo mussarela.',
      price: 'R$ 10,00',
      imageUrl: 'https://picsum.photos/seed/quibe/1080/1080'
    }
  ],
  [MenuTheme.OTHERS]: [
    {
      id: 'o1',
      name: 'Suco Natural Detox',
      description: 'Combinação refrescante de couve, abacaxi, maçã verde e gengibre. Sem adição de açúcar.',
      price: 'R$ 14,00',
      imageUrl: 'https://picsum.photos/seed/suco/1080/1080'
    },
    {
      id: 'o2',
      name: 'Cappuccino Artesanal',
      description: 'Café expresso de grãos selecionados, leite vaporizado cremoso e um toque de chocolate e canela.',
      price: 'R$ 11,00',
      imageUrl: 'https://picsum.photos/seed/cafe/1080/1080'
    },
    {
      id: 'o3',
      name: 'Combo Casal Especial',
      description: 'Escolha 2 salgados, 2 doces e 2 bebidas por um preço especial para compartilhar.',
      price: 'R$ 45,00',
      imageUrl: 'https://picsum.photos/seed/combo/1080/1080'
    }
  ]
};
