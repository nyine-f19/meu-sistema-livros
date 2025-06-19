/**
 * afranco - BV3044629
 * implementado em 18/06/2025
 * atulização 18/06/2025: Padronização do método de atualização e remoção de comentários.
*/
package afranco.api.service;

import afranco.api.exceptions.EntidadeNomeJaExisteException;
import afranco.api.exceptions.LivroNaoEncontradoException;
import afranco.api.model.Autor;
import afranco.api.model.Livro;
import afranco.api.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LivroService {

    @Autowired
    private LivroRepository livroRepository;

    @Autowired
    private AutorService autorService;

    public List<Livro> listar() {
        return livroRepository.findAll();
    }

    public Livro buscarOuFalhar(Long id) {
        return livroRepository.findById(id)
                .orElseThrow(() -> new LivroNaoEncontradoException("Livro com ID " + id + " não encontrado."));
    }

    public void deletar(Long id) {
        buscarOuFalhar(id);
        livroRepository.deleteById(id);
    }

    public Livro salvar(Livro livro) {
        Long autorId = livro.getAutor().getId();
        Autor autor = autorService.buscarOuFalhar(autorId);
        livro.setAutor(autor);

        Optional<Livro> livroExistente = livroRepository.findByTituloIgnoreCase(livro.getTitulo());
        if (livroExistente.isPresent() && !livroExistente.get().equals(livro)) {
            throw new EntidadeNomeJaExisteException("Já existe um livro cadastrado com o título '" + livro.getTitulo() + "'.");
        }

        return livroRepository.save(livro);
    }

    public void atualizar(Livro livro) {
        buscarOuFalhar(livro.getId());
        salvar(livro);
    }
}