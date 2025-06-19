/**
 * afranco - BV3044629
 * implementado em 18/06/2025
 * atulização 18/06/2025: Padronização da mensagem de exceção e remoção de comentários.
 */
package afranco.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import afranco.api.exceptions.AutorNaoEncontradoException;
import afranco.api.exceptions.EntidadeNomeJaExisteException;
import afranco.api.model.Autor;
import afranco.api.repository.AutorRepository;

@Service
public class AutorService {

    @Autowired
    private AutorRepository autorRepository;

    public Autor buscarOuFalhar(Long id) {
        return autorRepository.findById(id)
            .orElseThrow( () -> new AutorNaoEncontradoException("Autor com ID " + id + " não encontrado.")); // [MODIFICADO]
    }

    public Autor salvar(Autor autor) {
    	var autorOptional = autorRepository.findByNomeIgnoreCase(autor.getNome());
		if ( autorOptional.isPresent() 
				&& !autorOptional.get().equals(autor) ) {
			throw new EntidadeNomeJaExisteException(autor.getNome(), 
					autorOptional.get().getId());
		}
		
        return autorRepository.saveAndFlush(autor);
    }

    public void deletar(Long id) {
        buscarOuFalhar(id);
        autorRepository.deleteById(id);
    }

    public void atualizar(Autor autor) {
        buscarOuFalhar(autor.getId());
        salvar(autor);
    }

}