import React from 'react';
import styles from './AtletaCard.module.css'; // Importa os estilos do CSS Module

function AtletaCard({ atleta, onToggleExpand, isExpanded }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <img 
          src={atleta.imagemUrl || 'https://via.placeholder.com/150'} 
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
        <p className={styles.biografiaResumo}>{atleta.biografia.substring(0, 150)}...</p>
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
        </div>
      )}
    </div>
  );
}

export default AtletaCard;