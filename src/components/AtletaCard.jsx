import React from 'react';
import styles from './AtletaCard.module.css';

function AtletaCard({ atleta, onToggleExpand, isExpanded }) {
  // 🎯 CORREÇÃO: Usa a nova estrutura de fotos
  const imagemUrl = atleta.fotos?.[0]?.url || atleta.imagemUrl || 'https://via.placeholder.com/150';
  
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <img 
          src={imagemUrl}  // ✅ AGORA USA A NOVA ESTRUTURA
          alt={atleta.nome} 
          className={styles.foto} 
        />
        <div className={styles.infoPrincipal}>
          <span className={styles.antessala}>ANTESSALA</span>
          <h3 className={styles.nome}>{atleta.nome}</h3>
          <p className={styles.modalidade}>{atleta.modalidade}</p>
        </div>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.biografiaResumo}>{atleta.biografia?.substring(0, 150)}...</p>
      </div>
      <div className={styles.cardFooter}>
        <button onClick={() => onToggleExpand(atleta.id)} className={styles.btnConheca}>
          {isExpanded ? 'RECOLHER' : 'CONHEÇA'}
        </button>
      </div>

      {isExpanded && (
        <div className={styles.detalhesExpandidos}>
          <h4>Biografia Completa</h4>
          <p>{atleta.biografia}</p>
          <h4>Competições e Títulos</h4>
          <p>{atleta.competicao}</p>
          {/* 🎯 BÔNUS: Mostra todas as fotos quando expandido */}
          {atleta.fotos?.map((foto, index) => (
            <div key={index} className={styles.fotoExpandida}>
              <img src={foto.url} alt={foto.legenda} />
              <p className={styles.legenda}>{foto.legenda}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AtletaCard;