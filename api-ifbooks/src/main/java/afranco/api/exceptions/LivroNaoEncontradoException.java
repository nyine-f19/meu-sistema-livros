/**
 * afranco - BV3044629
 * implementado em 18/06/2025
 * atulização 18/06/2025: Padronização do construtor e remoção da anotação @ResponseStatus.
 */
package afranco.api.exceptions;

public class LivroNaoEncontradoException extends RuntimeException {

    public LivroNaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}