package iuh.fit.order_service.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import iuh.fit.order_service.models.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.details WHERE o.userId = :userId ORDER BY o.orderDate DESC")
    List<Order> findByUserIdWithDetails(@Param("userId") Long userId);
}
