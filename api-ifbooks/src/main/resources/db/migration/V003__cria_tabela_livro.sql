CREATE TABLE livro (
    id BIGINT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    data_publicacao DATE,
    editora VARCHAR(70),
    resumo VARCHAR(512),
    autor_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (autor_id) REFERENCES autor(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;