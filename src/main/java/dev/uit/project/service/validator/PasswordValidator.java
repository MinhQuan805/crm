package dev.uit.project.service.validator;

import org.springframework.stereotype.Component;

@Component
public class PasswordValidator {

    public boolean isValid(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }

        boolean hasUpperCase = password.chars().anyMatch(Character::isUpperCase);
        boolean hasLowerCase = password.chars().anyMatch(Character::isLowerCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);

        return hasUpperCase && hasLowerCase && hasDigit;
    }
}
