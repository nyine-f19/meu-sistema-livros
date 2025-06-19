/**
 * afranco implementado em 04/2025
 * Todas os end-points do recurso /autores estarao aqui (Responsabilidade unica)
 * Ajustes:   05/2025: add evolucao do slide de aula
 *            05/2025: add formato XML no metodo buscar
 *            05/2025: alterado para uso do handler
*/

package afranco.api.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.bind.annotation.PutMapping;

import afranco.api.model.Autor;
import afranco.api.repository.AutorRepository;
import afranco.api.service.AutorService;


@RestController
@RequestMapping("/autores")
@CrossOrigin
public class AutorController {

    @Autowired
    private AutorRepository autorRepository;

    @Autowired
    private AutorService autorService;

    @GetMapping(produces = {MediaType.APPLICATION_JSON_VALUE, 
             MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<List<Autor>> listar() {
        return ResponseEntity.status(HttpStatus.OK).body(autorRepository.findAll());
    }
    
    @GetMapping("/{id}")   
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        Autor autorEncontrado = autorService.buscarOuFalhar(id);
        return ResponseEntity.status(HttpStatus.OK).body(autorEncontrado);
    }

    @PostMapping
    public ResponseEntity<Void> salvar(@RequestBody Autor autor) {
        autor = autorService.salvar(autor);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(autor.getId())
            .toUri();
        return ResponseEntity.created(uri).build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        autorService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> alterar(@PathVariable Long id, @RequestBody Autor autor) {
        autor.setId(id);
        autorService.atualizar(autor);
        return ResponseEntity.noContent().build();
    }
    
}