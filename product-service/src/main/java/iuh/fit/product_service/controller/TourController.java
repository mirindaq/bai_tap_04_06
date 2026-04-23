package iuh.fit.product_service.controller;

import iuh.fit.product_service.entity.Product;
import iuh.fit.product_service.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tours")
@RequiredArgsConstructor
public class TourController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getTours() {
        return ResponseEntity.ok(productService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getTourById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }
}
