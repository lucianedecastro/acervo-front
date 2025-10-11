import React, { useState } from 'react';
import styles from './AtletaCard.module.css';

function AtletaCard({ atleta, onToggleExpand, isExpanded }) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // 🎯 CORREÇÃO: Função para remover duplicatas baseada no ID ou URL
  const getFotosUnicas = () => {
    if (!atleta.fotos?.length) return [];
    
    const fotosUnicas = [];
    const idsVistos = new Set();
    const urlsVistas = new Set();
    
    atleta.fotos.forEach(foto => {
      // Se a foto tem ID, usa como chave única
      if (foto.id) {
        if (!idsVistos.has(foto.id)) {
          idsVistos.add(foto.id);
          fotosUnicas.push(foto);
        }
      } 
      // Se não tem ID, usa a URL como chave única
      else if (foto.url && !urlsVistas.has(foto.url)) {
        urlsVistas.add(foto.url);
        fotosUnicas.push(foto);
      }
    });
    
    return fotosUnicas;
  };

  // 🎯 CORREÇÃO: Filtra fotos válidas E únicas
  const getFotosValidas = () => {
    const fotosUnicas = getFotosUnicas();
    return fotosUnicas.filter(foto => 
      foto.url && foto.url.includes('storage.googleapis.com')
    );
  };

  // 🎯 CORREÇÃO AVANÇADA: Usa foto destaque ou fallback inteligente
  const getFotoCard = () => {
    const fotosValidas = getFotosValidas();
    
    // 1. Tenta encontrar a foto marcada como destaque
    const fotoDestaque = fotosValidas.find(foto => foto.ehDestaque);
    if (fotoDestaque) return fotoDestaque.url;
    
    // 2. Tenta usar fotoDestaqueId se existir
    if (atleta.fotoDestaqueId) {
      const fotoPorId = fotosValidas.find(foto => foto.id === atleta.fotoDestaqueId);
      if (fotoPorId) return fotoPorId.url;
    }
    
    // 3. Fallback para primeira foto válida
    if (fotosValidas[0]?.url) return fotosValidas[0].url;
    
    // 4. Fallback para estrutura antiga (compatibilidade)
    if (atleta.imagemUrl) return atleta.imagemUrl;
    
    // 5. Fallback final
    return 'https://via.placeholder.com/300x200/4A5568/FFFFFF?text=Imagem+Indisponível';
  };

  const fotosValidas = getFotosValidas();
  const imagemUrl = getFotoCard();

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };
  
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.fotoContainer}>
          {imageLoading && (
            <div className={styles.imageSkeleton}></div>
          )}
          <img 
            src={imagemUrl}
            alt={atleta.nome} 
            className={`${styles.foto} ${imageError ? styles.fotoError : ''}`}
            onLoad={handleImageLoad}
            onError={(e) => {
              handleImageError();
              e.target.src = 'https://via.placeholder.com/300x200/4A5568/FFFFFF?text=Erro+ao+Carregar';
            }}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
        </div>
        <div className={styles.infoPrincipal}>
          <span className={styles.atleta}>ATLETA</span>
          <h3 className={styles.nome}>{atleta.nome}</h3>
          <p className={styles.modalidade}>{atleta.modalidade}</p>
          {/* 🎯 CORREÇÃO: Badge mostra APENAS fotos válidas e únicas */}
          {fotosValidas.length > 1 && (
            <span className={styles.fotoBadge}>📸 {fotosValidas.length} fotos</span>
          )}
        </div>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.biografiaResumo}>
          {atleta.biografia?.substring(0, 150)}...
        </p>
      </div>
      <div className={styles.cardFooter}>
        <button 
          onClick={() => onToggleExpand(atleta.id)} 
          className={styles.btnConheca}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'RECOLHER' : 'CONHEÇA'}
        </button>
      </div>

      {isExpanded && (
        <div className={styles.detalhesExpandidos}>
          <h4>Biografia Completa</h4>
          <p className={styles.biografiaCompleta}>{atleta.biografia}</p>
          
          <h4>Competições e Títulos</h4>
          <p className={styles.competicao}>{atleta.competicao}</p>
          
          {/* 🎯 CORREÇÃO: Galeria mostra APENAS fotos válidas e únicas */}
          {fotosValidas.length > 0 && (
            <>
              <h4>Galeria de Fotos ({fotosValidas.length})</h4>
              <div className={styles.galeria}>
                {fotosValidas.map((foto) => (
                  <div 
                    key={foto.id || foto.url}
                    className={styles.fotoExpandida}
                  >
                    <div className={styles.fotoGaleriaContainer}>
                      <img 
                        src={foto.url} 
                        alt={foto.legenda || `Foto de ${atleta.nome}`}
                        className={`${styles.fotoGaleria} ${foto.ehDestaque ? styles.fotoDestaque : ''}`}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200/718096/FFFFFF?text=Foto+Não+Encontrada';
                        }}
                        loading="lazy"
                      />
                    </div>
                    {foto.legenda && (
                      <p className={styles.legenda}>
                        {foto.legenda}
                        {foto.ehDestaque && <span className={styles.destaqueBadge}> ⭐ Destaque</span>}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* 🎯 AVISO se todas as fotos foram filtradas */}
          {atleta.fotos?.length > 0 && fotosValidas.length === 0 && (
            <div className={styles.semFotos}>
              <p>⚠️ Esta atleta tem {atleta.fotos.length} foto(s) no cadastro, mas nenhuma foi encontrada no servidor.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AtletaCard;