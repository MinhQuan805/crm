package dev.uit.project.controller.admin;

import dev.uit.project.domain.dto.*;
import dev.uit.project.service.PricingService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class PricingController {

    private final PricingService pricingService;

    public PricingController(PricingService pricingService) {
        this.pricingService = pricingService;
    }

    // Seasonal Pricing
    @GetMapping("/pricing/seasonal")
    public ResponseEntity<List<SeasonalPriceDTO>> getSeasonalPrices(
            @RequestParam(required = false) Long roomTypeId) {
        return ResponseEntity.ok(pricingService.getAllSeasonalPrices(roomTypeId));
    }

    @PostMapping("/pricing/seasonal")
    public ResponseEntity<SeasonalPriceDTO> createSeasonalPrice(@RequestBody Map<String, Object> body) {
        Long roomTypeId = Long.valueOf(body.get("roomTypeId").toString());
        String name = (String) body.get("name");
        LocalDate startDate = LocalDate.parse((String) body.get("startDate"));
        LocalDate endDate = LocalDate.parse((String) body.get("endDate"));
        BigDecimal priceMultiplier = new BigDecimal(body.get("priceMultiplier").toString());
        Integer priority = body.get("priority") != null ? Integer.valueOf(body.get("priority").toString()) : null;

        return ResponseEntity.ok(pricingService.createSeasonalPrice(roomTypeId, name, startDate, endDate,
                priceMultiplier, priority));
    }

    @DeleteMapping("/pricing/seasonal/{id}")
    public ResponseEntity<Void> deleteSeasonalPrice(@PathVariable Long id) {
        pricingService.deleteSeasonalPrice(id);
        return ResponseEntity.noContent().build();
    }

    // Daily Pricing
    @GetMapping("/pricing/daily")
    public ResponseEntity<List<DailyPriceDTO>> getDailyPrices(
            @RequestParam(required = false) Long roomTypeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(pricingService.getDailyPrices(roomTypeId, startDate, endDate));
    }

    @PutMapping("/pricing/daily/{roomTypeId}")
    public ResponseEntity<DailyPriceDTO> setDailyPrice(
            @PathVariable Long roomTypeId,
            @RequestBody Map<String, Object> body) {
        LocalDate date = LocalDate.parse((String) body.get("date"));
        BigDecimal price = new BigDecimal(body.get("price").toString());
        String reason = (String) body.get("reason");

        return ResponseEntity.ok(pricingService.setDailyPrice(roomTypeId, date, price, reason));
    }

    // Promotions
    @GetMapping("/pricing/promotions")
    public ResponseEntity<List<PromotionDTO>> getAllPromotions() {
        return ResponseEntity.ok(pricingService.getAllPromotions());
    }

    @PostMapping("/pricing/promotions")
    public ResponseEntity<PromotionDTO> createPromotion(@Valid @RequestBody CreatePromotionRequest request) {
        return ResponseEntity.ok(pricingService.createPromotion(request));
    }

    @PutMapping("/pricing/promotions/{id}/toggle")
    public ResponseEntity<PromotionDTO> togglePromotion(@PathVariable Long id) {
        return ResponseEntity.ok(pricingService.togglePromotion(id));
    }
}
