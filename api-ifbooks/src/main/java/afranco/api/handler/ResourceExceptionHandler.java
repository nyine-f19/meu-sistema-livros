/**
 * afranco - BV3044629
 * implementado em 18/06/2025
 * atulização 18/06/2025: Padronização do tratamento de exceções para Autor e Livro.
 */
package afranco.api.handler;

import javax.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import afranco.api.exceptions.AutorNaoEncontradoException;
import afranco.api.exceptions.LivroNaoEncontradoException;

@ControllerAdvice
public class ResourceExceptionHandler {

    private static class ErrorResponse {
        private String error;
        private String message;

        public ErrorResponse(String error, String message) {
            this.error = error;
            this.message = message;
        }
        
        public String getError() { return error; }
        public String getMessage() { return message; }
    }

    @ExceptionHandler(AutorNaoEncontradoException.class)
    public ResponseEntity<ErrorResponse> handleAutorNaoEncontradoException(AutorNaoEncontradoException e, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("Recurso não encontrado", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
    
    @ExceptionHandler(LivroNaoEncontradoException.class)
    public ResponseEntity<ErrorResponse> handleLivroNaoEncontradoException(LivroNaoEncontradoException e, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("Recurso não encontrado", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleDemaisExceptions(Exception e, HttpServletRequest request){
        ErrorResponse errorResponse = new ErrorResponse(
            "Erro Inesperado no Servidor",
            "Ocorreu um erro inesperado no sistema. Por favor, tente novamente."
        );
        
        e.printStackTrace();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}