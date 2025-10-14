import React from 'react';
import { Link } from 'react-router-dom'; 
import styles from './AtletaCard.module.css';

function AtletaCard({ atleta }) {
  
  
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
    <div className={styles.card}>
      {/* O container da imagem não mudou */}
      <div className={styles.cardHeader}>
        
        <div 
          className={styles.foto}
          style={{ backgroundImage: `url(${imagemUrl})` }}
          role="img"
          aria-label={`Foto de ${atleta.nome}`}
        ></div>
        
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
    </div>
  );
}

export default AtletaCard;