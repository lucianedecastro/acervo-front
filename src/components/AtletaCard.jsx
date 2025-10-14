// components/AtletaCard.jsx

import React from 'react';
import { Link } from 'react-router-dom'; 
import styles from './AtletaCard.module.css';

function AtletaCard({ atleta, onToggleExpand, isExpanded }) {
  
  
  const getFotosUnicas = () => {
    if (!atleta.fotos?.length) return [];
    
    const fotosUnicas = [];
    const idsVistos = new Set();
    const urlsVistas = new Set();
    
    atleta.fotos.forEach(foto => {
      if (foto.id) {
        if (!idsVistos.has(foto.id)) {
          idsVistos.add(foto.id);
          fotosUnicas.push(foto);
        }
      } 
      else if (foto.url && !urlsVistas.has(foto.url)) {
        urlsVistas.add(foto.url);
        fotosUnicas.push(foto);
      }
    });
    return fotosUnicas;
  };

  const getFotosValidas = () => {
    const fotosUnicas = getFotosUnicas();
    return fotosUnicas.filter(foto => 
      foto.url && foto.url.includes('storage.googleapis.com')
    );
  };

  const getFotoCard = () => {
    const fotosValidas = getFotosValidas();
    const fotoDestaque = fotosValidas.find(foto => foto.ehDestaque);
    if (fotoDestaque) return fotoDestaque.url;
    
    if (atleta.fotoDestaqueId) {
      const fotoPorId = fotosValidas.find(foto => foto.id === atleta.fotoDestaqueId);
      if (fotoPorId) return fotoPorId.url;
    }
    
    if (fotosValidas[0]?.url) return fotosValidas[0].url;
    if (atleta.imagemUrl) return atleta.imagemUrl;
    
    return 'https://via.placeholder.com/300x200/4A5568/FFFFFF?text=Imagem+Indisponível';
  };

  const fotosValidas = getFotosValidas();
  const imagemUrl = getFotoCard();
  
  return (
    
    <div className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}>
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
        
        <Link 
          to={`/atletas/${atleta.id}`}
          className={styles.btnConheca}
        >
          CONHEÇA
        </Link>
      </div>

      
      {isExpanded && (
        <div className={styles.detalhesExpandidos}>
          <h4>Biografia Completa</h4>
          <p>{atleta.biografia}</p>
          
          <h4>Competições e Títulos</h4>
          <p>{atleta.competicao}</p>
          
          {fotosValidas.length > 0 && (
            <>
              <h4>Galeria de Fotos ({fotosValidas.length})</h4>
              <div className={styles.galeria}>
                {fotosValidas.map((foto) => (
                  <div 
                    key={foto.id || foto.url} 
                    className={styles.fotoExpandida}
                  >
                    <img 
                      src={foto.url} 
                      alt={foto.legenda || `Foto de ${atleta.nome}`}
                      className={foto.ehDestaque ? styles.fotoDestaque : ''}
                      onError={(e) => {
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