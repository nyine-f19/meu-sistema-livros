/**
 * afranco - BV3044629
 * implementado em 18/06/2025
 * atulização 18/06/2025: Padronização e remoção de comentários.
 */
package afranco.api.repository;

import afranco.api.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LivroRepository extends JpaRepository<Livro, Long> {

    Optional<Livro> findByTituloIgnoreCase(String titulo);
}