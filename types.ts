
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

export interface BusinessInfo {
  name: string;
  tagline: string;
  logo: string;
  instagram: string;
  whatsapp: string;
  primaryColor: string;
  textColor: string;
}

export enum MenuTheme {
  SWEETS = 'Doces',
  SAVORIES = 'Salgados',
  OTHERS = 'Outros'
}
