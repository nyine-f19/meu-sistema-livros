CREATE TABLE autor (
    id bigint NOT NULL AUTO_INCREMENT,
    nome varchar(80) NOT NULL,
    data_nascimento date,
    nacionalidade varchar(20) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;