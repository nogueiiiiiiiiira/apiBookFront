import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import style from "./style.module.css";
import Menu from '../components/Menu';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState({});

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
        const bookData = response.data;
        const parser = new DOMParser();
        const descriptionHtml = bookData.volumeInfo.description;
        const descriptionDoc = parser.parseFromString(descriptionHtml, 'text/html');
        const descriptionText = descriptionDoc.body.textContent.trim();
        setBook({...bookData, descriptionText });
      } catch (error) {
        console.error(error);
      }
    };
    fetchBook();
  }, [id]);

  if (!book.volumeInfo) {
    return <p>Carregando...</p>;
  }

  if (!book.volumeInfo.title) {
    return <p>Livro não encontrado.</p>;
  }

  return (
    <div>
        <Menu />
        <div className={style.center}>
        <div>
            <br />
            <h1 className="text-center mb-3">{book.volumeInfo.title}</h1>
            <br />
            <img className={style.imagem} src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
            <br />
            <br />
            <label>Autor:</label>
            <p>{book.volumeInfo.authors.join(', ')}</p>
            <label>Descrição:</label>
            <br />
            <div className={style.desc}>
                <p>{book.descriptionText}</p>
            </div>
        </div>
    </div>
    </div> 
  );
};

export default BookDetails;