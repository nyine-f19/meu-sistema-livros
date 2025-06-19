/* 
package afranco.api;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import afranco.api.model.Autor;


   * @author afranco - 04/2025
   * Cria objeto Autor usando collections de forma fixa para exemplificacao dos end points


@Service
public class AutoresFixCollections {

    private List<Autor> autores = new ArrayList<>();
    private Autor autor1, autor2, autor3;

    public AutoresFixCollections() {
        autor1 = criar(1L, "FIXO-> Robert Martin", "USA", LocalDate.of(1983, 4, 4) );
        autor2 = criar(2L, "FIXO-> Andrew Tanenbaum", "USA", LocalDate.of(1992, 7, 22));
        autor3 = criar(3L, "FIXO-> Francisco Pinheiro", "BRA", LocalDate.of(1997, 9, 15));

        autores.add(autor1);
        autores.add(autor2);
        autores.add(autor3);
    }


    public List<Autor> listarArray(){
        Autor[] autoresArray = {autor1, autor2, autor3};
        return Arrays.asList(autoresArray);
    }


    public List<Autor> listar(){
        return autores;
    }


    public Autor buscar(Long id){
        return autores.stream().filter(autor -> autor.getId().equals(id))
            .findFirst()
            .orElse(null);
    }

    private Autor criar(Long id, String nome, String nacionalidade, LocalDate dataNascimento){
        Autor novoAutor = new Autor();
        novoAutor.setId(id);
        novoAutor.setNome(nome);
        novoAutor.setNacionalidade(nacionalidade);
        novoAutor.setDataNascimento(dataNascimento);
        return novoAutor;
    }
}

*/