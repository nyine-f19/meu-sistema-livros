package afranco.api.exceptions;

public class AutorNaoEncontradoException extends RuntimeException {
    
    public AutorNaoEncontradoException(String mensagem) {
        super("Autor não encontrado.");
    }

}