import React, { useEffect, useState } from 'react';
import Menu from "../components/Menu";
import { apiBooks } from "../api/server";
import Card from "../components/Card";
import style from './apiBooks.module.css';

export const ApiBooksComponent = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Função para buscar livros
    const fetchBooks = async (query) => {
        try {
            const response = await apiBooks.get(`?q=${query}`);
            if (!response.data.items || response.data.items.length === 0) {
                console.log("Nenhum livro encontrado!");
                setData([]);
            } else {
                setData(response.data.items);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    console.log("Livro não encontrado!");
                } else if (error.response.status === 503) {
                    console.log("Serviço indisponível!");
                } else {
                    console.log(`Erro: ${error.response.statusText}`);
                }
            } else {
                console.error("Erro na requisição:", error);
            }
        }
    };

    useEffect(() => {
        fetchBooks("bestsellers");
    }, []);

    useEffect(() => {
        if (searchTerm) {
            fetchBooks(searchTerm);
        }
    }, [searchTerm]);

    return (
        <>
            <Menu />
            <div className={style.wrapBooks}>
                <h1>Google Books API</h1>
                <input
                    type="text"
                    placeholder="Digite o nome do livro"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
                <br />
                <section className={style.cardsBooks}>
                    {data.length > 0 ? (
                        data.map((book) => (
                            <Card
                                key={book.id}
                                title={book.volumeInfo.title}
                                desc={book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : "Autor desconhecido"}
                                value={book.volumeInfo.description ? book.volumeInfo.description : "Sem descrição"}
                                imgSrc2={book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "https://via.placeholder.com/150"}
                            />
                        ))
                    ) : (
                        <p>Nenhum livro encontrado.</p>
                    )}
                </section>
            </div>
        </>
    );
};
