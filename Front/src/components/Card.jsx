import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import style from './Card.module.css';

const Card = ({ title, imgSrc2, desc, value, id }) => {
  const maxDescLength = 100;

  const renderDescription = () => {
    if (desc.length > maxDescLength) {
      return desc.substring(0, maxDescLength) + '...';
    } else {
      return desc;
    }
  };

  return (
    <div className={style.wrapCard}>
      <div className={style.Card}>
        <h3 className={style.cardTitle}>{title || 'Título Desconhecido'}</h3>
        <img
          className={style.img2}
          src={imgSrc2 || 'https://via.placeholder.com/150'}
          alt={title || 'Imagem de livro'}
          width={150}
          height="auto"
        />
        <br />
        <div className={style.cardBody}>
          <p className={style.cardText}>{renderDescription()}</p>
          <p>{value || 'Sem informação adicional'}</p>
          <Link to={`/book/${id}`}>Ler mais</Link>
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  imgSrc2: PropTypes.string,
  desc: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

Card.defaultProps = {
  title: 'Título Desconhecido',
  imgSrc2: 'https://via.placeholder.com/150',
  desc: 'Descrição não disponível',
  value: 'Sem informação adicional',
};

export default Card;