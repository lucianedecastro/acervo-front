import React from 'react';
import styles from './AtletaCard.module.css';

function AtletaCard({ atleta, onToggleExpand, isExpanded }) {
  // 🎯 CORREÇÃO AVANÇADA: Usa foto destaque ou fallback inteligente
  const getFotoCard = () => {
    // 1. Tenta encontrar a foto marcada como destaque
    const fotoDestaque = atleta.fotos?.find(foto => foto.ehDestaque);
    if (fotoDestaque) return fotoDestaque.url;
    
    // 2. Tenta usar fotoDestaqueId se existir
    if (atleta.fotoDestaqueId) {
      const fotoPorId = atleta.fotos?.find(foto => foto.id === atleta.fotoDestaqueId);
      if (fotoPorId) return fotoPorId.url;
    }
    
    // 3. Fallback para primeira foto
    if (atleta.fotos?.[0]?.url) return atleta.fotos[0].url;
    
    // 4. Fallback para estrutura antiga (compatibilidade)
    if (atleta.imagemUrl) return atleta.imagemUrl;
    
    // 5. Fallback final
    return 'https://via.placeholder.com/300x200/4A5568/FFFFFF?text=Imagem+Indisponível';
  };

  // 🎯 NOVO: Filtra apenas fotos válidas (que existem no bucket)
  const getFotosValidas = () => {
    return atleta.fotos?.filter(foto => 
      foto.url && foto.url.includes('storage.googleapis.com')
    ) || [];
  };

  const fotosValidas = getFotosValidas();
  const imagemUrl = getFotoCard();
  
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <img 
          src={imagemUrl}
          alt={atleta.nome} 
          className={styles.foto} 
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200/4A5568/FFFFFF?text=Erro+ao+Carregar';
          }}
        />
        <div className={styles.infoPrincipal}>
          <span className={styles.atleta}>ATLETA</span>
          <h3 className={styles.nome}>{atleta.nome}</h3>
          <p className={styles.modalidade}>{atleta.modalidade}</p>
          {/* 🎯 CORREÇÃO: Badge mostra APENAS fotos válidas */}
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
        >
          {isExpanded ? 'RECOLHER' : 'CONHEÇA'}
        </button>
      </div>

      {isExpanded && (
        <div className={styles.detalhesExpandidos}>
          <h4>Biografia Completa</h4>
          <p>{atleta.biografia}</p>
          
          <h4>Competições e Títulos</h4>
          <p>{atleta.competicao}</p>
          
          {/* 🎯 CORREÇÃO: Galeria mostra APENAS fotos válidas */}
          {fotosValidas.length > 0 && (
            <>
              <h4>Galeria de Fotos ({fotosValidas.length})</h4>
              <div className={styles.galeria}>
                {fotosValidas.map((foto, index) => (
                  <div key={foto.id || index} className={styles.fotoExpandida}>
                    <img 
                      src={foto.url} 
                      alt={foto.legenda || `Foto ${index + 1} de ${atleta.nome}`}
                      className={foto.ehDestaque ? styles.fotoDestaque : ''}
                      onError={(e) => {
                        // 🎯 Se foto não carregar, mostra placeholder
                        e.target.src = 'https://via.placeholder.com/300x200/718096/FFFFFF?text=Foto+Não+Encontrada';
                      }}
                    />
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