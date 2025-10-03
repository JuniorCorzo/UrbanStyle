package io.github.juniorcorzo.UrbanStyle.terms.application.exceptions;

public class TermsInsertionException extends RuntimeException {
  public TermsInsertionException() {
    super("Error inserting terms");
  }

  public TermsInsertionException(String message) {
    super(message);
  }

}
