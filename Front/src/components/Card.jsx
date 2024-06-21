import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import style from './Card.module.css';

const Card = ({ title, imgSrc2, desc, value }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const renderDescription = () => {
    const maxDescLength = 100;
    if (desc.length > maxDescLength) {
      return (
        <>
          {desc.substring(0, maxDescLength)}...
          <br />
          <span className={style.readMore} onClick={handleShowModal}>
            Mostrar mais
          </span>
          <br />
        </>
      );
    } else {
      return desc;
    }
  };

  return (
    <div className={style.wrapCard}>
      <div className={style.Card} onClick={() => setShowModal(true)}>
        <h2 className={style.cardTitle}>{title}</h2>
        <img
          className={style.img2}
          src={imgSrc2}
          alt={title}
          width={150}
          height="auto"
        />
        <div className={style.cardBody}>
          <p className={style.cardText}>{renderDescription()}</p>
          <p>{value}</p>
        </div>
      </div>
  
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <img
              src={imgSrc2}
              alt={title}
              className="img-fluid mb-3"
            />
            <p>{desc}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
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
