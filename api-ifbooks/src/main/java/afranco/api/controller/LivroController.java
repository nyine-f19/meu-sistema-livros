/**
 * afranco - BV3044629
 * implementado em 18/06/2025
 * atulização 18/06/2025: Padronização de todos os endpoints para usar ResponseEntity.
 */
package afranco.api.controller;

import afranco.api.model.Livro;
import afranco.api.service.LivroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/livros")
@CrossOrigin(origins = "*")
public class LivroController {

    @Autowired
    private LivroService livroService;

    @GetMapping
    public ResponseEntity<List<Livro>> listar() {
        return ResponseEntity.status(HttpStatus.OK).body(livroService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livro> buscar(@PathVariable Long id) {
        Livro livro = livroService.buscarOuFalhar(id);
        return ResponseEntity.ok(livro);
    }

    @PostMapping
    public ResponseEntity<Void> adicionar(@RequestBody Livro livro) {
        livro = livroService.salvar(livro);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(livro.getId())
            .toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> alterar(@PathVariable Long id, @RequestBody Livro livro) {
        livro.setId(id);
        livroService.atualizar(livro);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        livroService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}