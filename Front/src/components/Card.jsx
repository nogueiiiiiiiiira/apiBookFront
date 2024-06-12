import React from 'react';
import PropTypes from 'prop-types';
import style from './Card.module.css';

const Card = ({ title, imgSrc2, desc, value }) => {
  return (
    <div className={style.wrapCard}>
      <div className={style.Card}>
        <h2 className={style.cardTitle}>{title || 'Título Desconhecido'}</h2>
        <img
          className={style.img2}
          src={imgSrc2 || 'https://via.placeholder.com/150'}
          alt={title || 'Imagem de livro'}
          width={150}
          height="auto"
        />
        <div className={style.cardBody}>
          <p className={style.cardText}>{desc || 'Descrição não disponível'}</p>
          <p>{value || 'Sem informação adicional'}</p>
        </div>
      </div>
    </div>
  );
};

// Definindo tipos das propriedades
Card.propTypes = {
  title: PropTypes.string,
  imgSrc2: PropTypes.string,
  desc: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

// Definindo valores padrão para as propriedades
Card.defaultProps = {
  title: 'Título Desconhecido',
  imgSrc2: 'https://via.placeholder.com/150',
  desc: 'Descrição não disponível',
  value: 'Sem informação adicional',
};

export default Card;
