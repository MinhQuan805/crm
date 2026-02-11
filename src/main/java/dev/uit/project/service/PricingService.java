package dev.uit.project.service;

import dev.uit.project.domain.DailyPrice;
import dev.uit.project.domain.Promotion;
import dev.uit.project.domain.RoomType;
import dev.uit.project.domain.SeasonalPrice;
import dev.uit.project.domain.dto.*;
import dev.uit.project.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class PricingService {

    private final SeasonalPriceRepository seasonalPriceRepository;
    private final DailyPriceRepository dailyPriceRepository;
    private final PromotionRepository promotionRepository;
    private final RoomTypeRepository roomTypeRepository;

    public PricingService(SeasonalPriceRepository seasonalPriceRepository,
                          DailyPriceRepository dailyPriceRepository,
                          PromotionRepository promotionRepository,
                          RoomTypeRepository roomTypeRepository) {
        this.seasonalPriceRepository = seasonalPriceRepository;
        this.dailyPriceRepository = dailyPriceRepository;
        this.promotionRepository = promotionRepository;
        this.roomTypeRepository = roomTypeRepository;
    }

    // Seasonal Pricing
    @Transactional(readOnly = true)
    public List<SeasonalPriceDTO> getAllSeasonalPrices(Long roomTypeId) {
        if (roomTypeId != null) {
            return seasonalPriceRepository.findByRoomTypeIdOrderByPriorityDesc(roomTypeId)
                    .stream().map(SeasonalPriceDTO::fromEntity).toList();
        }
        return seasonalPriceRepository.findAll()
                .stream().map(SeasonalPriceDTO::fromEntity).toList();
    }

    @Transactional
    public SeasonalPriceDTO createSeasonalPrice(Long roomTypeId, String name,
                                                 LocalDate startDate, LocalDate endDate,
                                                 BigDecimal priceMultiplier, Integer priority) {
        RoomType roomType = roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new RuntimeException("Room type not found"));

        SeasonalPrice sp = new SeasonalPrice();
        sp.setRoomType(roomType);
        sp.setName(name);
        sp.setStartDate(startDate);
        sp.setEndDate(endDate);
        sp.setPriceMultiplier(priceMultiplier);
        sp.setPriority(priority != null ? priority : 0);

        return SeasonalPriceDTO.fromEntity(seasonalPriceRepository.save(sp));
    }

    @Transactional
    public void deleteSeasonalPrice(Long id) {
        seasonalPriceRepository.deleteById(id);
    }

    // Daily Pricing
    @Transactional(readOnly = true)
    public List<DailyPriceDTO> getDailyPrices(Long roomTypeId, LocalDate startDate, LocalDate endDate) {
        if (roomTypeId != null) {
            if (startDate != null && endDate != null) {
                return dailyPriceRepository.findByRoomTypeIdAndDateBetween(roomTypeId, startDate, endDate)
                        .stream().map(DailyPriceDTO::fromEntity).toList();
            }
            // Lấy tất cả daily prices cho roomType cụ thể
            return dailyPriceRepository.findAll().stream()
                    .filter(dp -> dp.getRoomType().getId().equals(roomTypeId))
                    .map(DailyPriceDTO::fromEntity).toList();
        }
        // Lấy tất cả daily prices
        if (startDate != null && endDate != null) {
            return dailyPriceRepository.findAll().stream()
                    .filter(dp -> !dp.getDate().isBefore(startDate) && !dp.getDate().isAfter(endDate))
                    .map(DailyPriceDTO::fromEntity).toList();
        }
        return dailyPriceRepository.findAll().stream().map(DailyPriceDTO::fromEntity).toList();
    }

    @Transactional
    public DailyPriceDTO setDailyPrice(Long roomTypeId, LocalDate date, BigDecimal price, String reason) {
        RoomType roomType = roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new RuntimeException("Room type not found"));

        DailyPrice dp = dailyPriceRepository.findByRoomTypeIdAndDate(roomTypeId, date)
                .orElse(new DailyPrice());

        dp.setRoomType(roomType);
        dp.setDate(date);
        dp.setPrice(price);
        dp.setReason(reason);

        return DailyPriceDTO.fromEntity(dailyPriceRepository.save(dp));
    }

    // Promotions
    @Transactional(readOnly = true)
    public List<PromotionDTO> getAllPromotions() {
        return promotionRepository.findAll().stream().map(PromotionDTO::fromEntity).toList();
    }

    @Transactional
    public PromotionDTO createPromotion(CreatePromotionRequest request) {
        if (promotionRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Promotion code already exists: " + request.getCode());
        }

        Promotion promotion = new Promotion();
        promotion.setCode(request.getCode().toUpperCase());
        promotion.setDescription(request.getDescription());
        promotion.setDiscountType(request.getDiscountType());
        promotion.setDiscountValue(request.getDiscountValue());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setMinNights(request.getMinNights());
        promotion.setMaxUses(request.getMaxUses());
        promotion.setUsedCount(0);
        promotion.setIsActive(true);

        return PromotionDTO.fromEntity(promotionRepository.save(promotion));
    }

    @Transactional
    public PromotionDTO togglePromotion(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id: " + id));
        promotion.setIsActive(!promotion.getIsActive());
        return PromotionDTO.fromEntity(promotionRepository.save(promotion));
    }
}
