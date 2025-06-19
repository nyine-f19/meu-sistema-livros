CREATE TABLE autor (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    data_nascimento DATE,
    nacionalidade VARCHAR(20) NOT NULL
);