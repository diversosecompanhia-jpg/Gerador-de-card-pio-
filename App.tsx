
import React, { useState, useRef, useEffect } from 'react';
import { MenuItem, BusinessInfo, MenuTheme } from './types';
import { THEME_EXAMPLES } from './constants';
import { generateIrresistibleDescription } from './services/geminiService';
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: 'Fanecos de Ternura',
    tagline: 'Sabor que abraça, doçura que encanta.',
    logo: 'https://i.imgur.com/8N78zRA.png',
    instagram: '@fanecosdeternura',
    whatsapp: '(11) 93264-1953',
    primaryColor: '#f39c12',
    textColor: '#fceec7'
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [selectedPostItem, setSelectedPostItem] = useState<MenuItem | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const postRef = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    applyTheme(MenuTheme.SWEETS);
  }, []);

  const addItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: 'Novo Item',
      description: 'Uma descrição irresistível...',
      price: 'R$ 0,00',
      imageUrl: 'https://picsum.photos/seed/' + Math.random() + '/1080/1080'
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, updates: Partial<MenuItem>) => {
    setItems(items.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const applyTheme = (theme: MenuTheme) => {
    setItems(THEME_EXAMPLES[theme]);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBusinessInfo({ ...businessInfo, logo: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateItem(id, { imageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateMagic = async (id: string, name: string) => {
    const desc = await generateIrresistibleDescription(name);
    updateItem(id, { description: desc });
  };

  const exportMenu = async () => {
    if (!menuRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(menuRef.current, {
        scale: 2,
        backgroundColor: '#000000',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `Cardapio_${businessInfo.name.replace(/\s+/g, '_')}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const exportPost = async (item: MenuItem) => {
    setSelectedPostItem(item);
    // Wait for state update and re-render of the hidden post div
    setTimeout(async () => {
      if (!postRef.current) return;
      setIsExporting(true);
      try {
        const canvas = await html2canvas(postRef.current, {
          width: 1080,
          height: 1080,
          scale: 1, // Already 1080px
          backgroundColor: '#000000',
          useCORS: true,
        });
        const link = document.createElement('a');
        link.download = `Post_${item.name.replace(/\s+/g, '_')}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.98);
        link.click();
      } catch (err) {
        console.error(err);
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen pb-20 bg-[#0f0f0f]">
      {/* Admin Control Bar */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-[#333] p-4 flex flex-wrap gap-4 items-center justify-center">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400">TEMA:</span>
          <div className="flex gap-1">
            <button onClick={() => applyTheme(MenuTheme.SWEETS)} className="px-3 py-1 text-[10px] bg-amber-600 rounded-full font-bold hover:bg-amber-500 transition-colors">Doces</button>
            <button onClick={() => applyTheme(MenuTheme.SAVORIES)} className="px-3 py-1 text-[10px] bg-amber-800 rounded-full font-bold hover:bg-amber-700 transition-colors">Salgados</button>
            <button onClick={() => applyTheme(MenuTheme.OTHERS)} className="px-3 py-1 text-[10px] bg-zinc-700 rounded-full font-bold hover:bg-zinc-600 transition-colors">Geral</button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="color" 
            value={businessInfo.primaryColor} 
            onChange={(e) => setBusinessInfo({...businessInfo, primaryColor: e.target.value})}
            className="w-8 h-8 rounded-full border-none cursor-pointer bg-transparent"
          />
          <input 
            type="color" 
            value={businessInfo.textColor} 
            onChange={(e) => setBusinessInfo({...businessInfo, textColor: e.target.value})}
            className="w-8 h-8 rounded-full border-none cursor-pointer bg-transparent"
          />
        </div>

        <button 
          onClick={() => document.getElementById('logo-input')?.click()}
          className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-zinc-600"
        >
          Mudar Logo
        </button>
        <input id="logo-input" type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />

        <button 
          onClick={addItem}
          className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all shadow-lg"
        >
          + Adicionar Item
        </button>

        <button 
          onClick={exportMenu}
          disabled={isExporting}
          className="bg-[#f39c12] hover:opacity-90 px-6 py-2 rounded-lg text-xs font-bold text-black flex items-center gap-2 transition-all"
        >
          {isExporting ? 'Processando...' : '🖼️ Exportar Cardápio JPG'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 mt-10 p-6">
        {/* Editor Area */}
        <div className="flex-1 space-y-8">
          <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
            <h2 className="text-2xl font-playfair mb-6 text-[#f39c12]">Dados do Negócio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Nome da Empresa</label>
                <input 
                  type="text" 
                  value={businessInfo.name} 
                  onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl focus:outline-none focus:border-[#f39c12] text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Slogan</label>
                <input 
                  type="text" 
                  value={businessInfo.tagline} 
                  onChange={(e) => setBusinessInfo({...businessInfo, tagline: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl focus:outline-none focus:border-[#f39c12] text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Instagram</label>
                <input 
                  type="text" 
                  value={businessInfo.instagram} 
                  onChange={(e) => setBusinessInfo({...businessInfo, instagram: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl focus:outline-none focus:border-[#f39c12] text-sm text-[#f39c12]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">WhatsApp</label>
                <input 
                  type="text" 
                  value={businessInfo.whatsapp} 
                  onChange={(e) => setBusinessInfo({...businessInfo, whatsapp: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl focus:outline-none focus:border-[#f39c12] text-sm text-[#f39c12]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-playfair text-[#f39c12]">Gerenciar Itens</h2>
            {items.map((item) => (
              <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col md:flex-row gap-6 hover:border-[#f39c12]/50 transition-all group">
                <div className="relative w-full md:w-32 h-32 flex-shrink-0">
                  <img src={item.imageUrl} className="w-full h-full object-cover rounded-xl border border-zinc-700 shadow-inner" alt={item.name} />
                  <button 
                    onClick={() => document.getElementById(`file-${item.id}`)?.click()}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity text-[10px] font-bold uppercase tracking-tighter"
                  >
                    Mudar Foto
                  </button>
                  <input id={`file-${item.id}`} type="file" className="hidden" accept="image/*" onChange={(e) => handleItemImageUpload(item.id, e)} />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <input 
                      type="text" 
                      value={item.name} 
                      onChange={(e) => updateItem(item.id, {name: e.target.value})}
                      className="flex-1 bg-transparent border-b border-zinc-700 p-1 text-lg font-bold focus:outline-none focus:border-[#f39c12]"
                    />
                    <input 
                      type="text" 
                      value={item.price} 
                      onChange={(e) => updateItem(item.id, {price: e.target.value})}
                      className="w-24 bg-transparent border-b border-zinc-700 p-1 text-lg font-bold text-[#f39c12] text-right focus:outline-none focus:border-[#f39c12]"
                    />
                  </div>
                  
                  <div className="relative">
                    <textarea 
                      value={item.description} 
                      onChange={(e) => updateItem(item.id, {description: e.target.value})}
                      rows={2}
                      className="w-full bg-zinc-800/50 border border-zinc-700 p-3 rounded-xl text-xs text-zinc-400 focus:outline-none focus:border-[#f39c12] resize-none"
                    />
                    <button 
                      onClick={() => handleGenerateMagic(item.id, item.name)}
                      className="absolute right-3 bottom-3 bg-[#f39c12] text-black w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                      title="Gerar descrição com IA"
                    >
                      🪄
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => exportPost(item)}
                      className="bg-zinc-100 hover:bg-white text-black px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all"
                    >
                      📸 Gerar Post Instagram
                    </button>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="bg-red-900/20 hover:bg-red-900/40 text-red-500 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="lg:w-[450px]">
          <div className="sticky top-28 space-y-6">
            <h2 className="text-xl font-playfair text-[#f39c12] flex items-center gap-2">
              <span className="bg-[#f39c12] w-2 h-8 rounded-full"></span>
              Visualização do Cardápio
            </h2>
            
            <div 
              ref={menuRef}
              className="bg-black border-4 shadow-2xl overflow-hidden p-8"
              style={{ borderColor: businessInfo.primaryColor, width: '100%', minHeight: '600px' }}
            >
              <div className="text-center mb-10">
                <div className="w-24 h-24 mx-auto rounded-full border-2 overflow-hidden bg-black mb-4 flex items-center justify-center" style={{ borderColor: businessInfo.primaryColor }}>
                  <img src={businessInfo.logo} className="w-full h-full object-cover" alt="Logo" />
                </div>
                <h1 className="text-3xl font-playfair uppercase tracking-widest mb-1" style={{ color: businessInfo.primaryColor }}>{businessInfo.name}</h1>
                <p className="text-[10px] opacity-70 tracking-[4px] font-light" style={{ color: businessInfo.textColor }}>{businessInfo.tagline}</p>
              </div>

              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.id} className="group">
                    <div className="flex justify-between items-baseline border-b border-dashed pb-1 mb-2" style={{ borderColor: businessInfo.primaryColor + '44' }}>
                      <h3 className="text-base font-semibold" style={{ color: businessInfo.textColor }}>{item.name}</h3>
                      <span className="font-bold text-sm" style={{ color: businessInfo.primaryColor }}>{item.price}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-60 italic" style={{ color: businessInfo.textColor }}>{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-6 border-t border-zinc-800 text-center">
                <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-2">Pedidos via Direct ou WhatsApp</p>
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs font-bold" style={{ color: businessInfo.primaryColor }}>{businessInfo.instagram}</span>
                  <span className="text-xs font-bold" style={{ color: businessInfo.primaryColor }}>{businessInfo.whatsapp}</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 italic text-[10px] text-zinc-500">
              Dica: O cardápio é gerado em alta definição para envio direto por WhatsApp ou postagem no feed.
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Renderers for High Res Export */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none">
        {selectedPostItem && (
          <div 
            ref={postRef}
            className="flex flex-col items-center justify-between p-12 bg-black relative"
            style={{ width: '1080px', height: '1080px', border: `16px solid ${businessInfo.primaryColor}` }}
          >
            {/* Header with Logo */}
            <div className="text-center w-full z-10">
              <div 
                className="w-32 h-32 mx-auto rounded-full border-4 overflow-hidden mb-4 bg-black flex items-center justify-center"
                style={{ borderColor: businessInfo.primaryColor }}
              >
                <img src={businessInfo.logo} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-3xl font-playfair uppercase tracking-[0.3em]" style={{ color: businessInfo.primaryColor }}>
                {businessInfo.name}
              </h2>
            </div>

            {/* Main Content - Item Square */}
            <div className="w-[80%] flex flex-col items-center z-10">
              <div className="w-full aspect-square rounded-3xl overflow-hidden border-4 shadow-2xl mb-8" style={{ borderColor: businessInfo.primaryColor }}>
                <img src={selectedPostItem.imageUrl} className="w-full h-full object-cover" />
              </div>
              <div className="text-center space-y-4">
                <h1 className="text-5xl font-playfair font-bold" style={{ color: businessInfo.textColor }}>
                  {selectedPostItem.name}
                </h1>
                <p className="text-2xl leading-relaxed opacity-90 font-light" style={{ color: businessInfo.textColor }}>
                  {selectedPostItem.description}
                </p>
                <div 
                  className="inline-block px-12 py-4 rounded-2xl text-3xl font-black uppercase mt-4 shadow-xl"
                  style={{ backgroundColor: businessInfo.primaryColor, color: '#000' }}
                >
                  {selectedPostItem.price}
                </div>
              </div>
            </div>

            {/* CTA Footer */}
            <div className="w-full text-center flex flex-col items-center gap-6 z-10 pb-8">
              <div 
                className="w-full h-[2px] opacity-20"
                style={{ background: `linear-gradient(90deg, transparent, ${businessInfo.primaryColor}, transparent)` }}
              ></div>
              <div className="flex justify-center gap-16 items-center">
                <div className="flex flex-col items-center">
                  <span className="text-lg uppercase tracking-widest opacity-50 font-bold mb-1" style={{ color: businessInfo.textColor }}>Instagram</span>
                  <span className="text-2xl font-bold" style={{ color: businessInfo.primaryColor }}>{businessInfo.instagram}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg uppercase tracking-widest opacity-50 font-bold mb-1" style={{ color: businessInfo.textColor }}>Faça seu Pedido</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold" style={{ color: businessInfo.primaryColor }}>{businessInfo.whatsapp}</span>
                  </div>
                </div>
              </div>
              <div 
                className="px-10 py-3 rounded-full border-2 text-xl font-bold uppercase tracking-wider"
                style={{ borderColor: businessInfo.primaryColor, color: businessInfo.primaryColor }}
              >
                Toque no link da bio para pedir
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
