CREATE TABLE livro (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    data_publicacao DATE,
    editora VARCHAR(70),
    resumo VARCHAR(512),
    autor_id BIGINT NOT NULL,
    FOREIGN KEY (autor_id) REFERENCES autor(id)
);