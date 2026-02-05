package dev.uit.project.service.specification;

import dev.uit.project.domain.User;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class UserSpecification {

    public static Specification<User> searchByKeyword(String keyword) {
        return (root, query, criteriaBuilder) -> {
            String likePattern = "%" + keyword.toLowerCase() + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("firstName")), likePattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("lastName")), likePattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("username")), likePattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), likePattern)
            );
        };
    }

    public static Specification<User> hasRoles(List<User.UserRole> roles) {
        return (root, query, criteriaBuilder) -> root.get("role").in(roles);
    }

    public static Specification<User> hasStatuses(List<User.UserStatus> statuses) {
        return (root, query, criteriaBuilder) -> root.get("status").in(statuses);
    }
}
