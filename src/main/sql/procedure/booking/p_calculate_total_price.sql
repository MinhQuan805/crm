CREATE OR REPLACE PROCEDURE p_calculate_total_price (
    p_room_id IN rooms.id%TYPE,
    p_check_in_date IN DATE,
    p_check_out_date IN DATE,
    p_promotion_code IN VARCHAR2 DEFAULT NULL,
    p_total_amount OUT NUMBER,
    p_original_amount OUT NUMBER,
    p_discount_amount OUT NUMBER,
    p_status OUT VARCHAR2,
    p_message OUT VARCHAR2
) IS 
    v_room_type_id NUMBER;
    v_base_price NUMBER;
    v_current_date DATE;
    v_day_price NUMBER;
    v_multiplier NUMBER;
    v_temp_price NUMBER;
    
    v_promo_id NUMBER;
    v_discount_type VARCHAR2(20);
    v_discount_value NUMBER;
    v_min_booking_amount NUMBER;
    v_max_discount_amount NUMBER;
BEGIN

    p_status := 'SUCCESS';
    p_message := '';
    p_total_amount := 0;
    p_original_amount := 0;
    p_discount_amount := 0;
    
    BEGIN
        SELECT r.room_id, rt.base_price
        INTO v_room_type, v_base_price
        FROM rooms r
        JOIN rooms_type rt ON r.room_type_id = rt.id
        WHERE r.room_id = p_room_id;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            p_status := 'ERROR';
            p_message := 'Room ID không tồn tại';
            RETURN;
    END;
    
    IF p_check_in_date >= p_check_out_date THEN
        p_status := 'ERROR';
        p_message := 'Ngày check-in phải trước ngày check-out';
        RETURN;
    END IF;
    
    v_current_date := TRUNC(p_check_in_date);
    
     WHILE v_current_date < TRUNC(p_check_out_date) LOOP
        BEGIN
            SELECT price
            INTO v_temp_price
            FROM daily_prices
            WHERE room_type_id = v_room_type_id
            AND price_date = v_current_date;
            
            v_day_price := v_temp_price;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                BEGIN
                    SELECT price_multiplier
                    INTO v_multiplier
                    FROM (
                        SELECT price_multiplier
                        FROM seasonal_prices
                        WHERE room_type_id = v_room_type_id
                          AND v_current_date BETWEEN start_date AND end_date
                        ORDER BY priority DESC, id DESC
                    )
                    WHERE ROWNUM = 1;
                    
                    v_day_price := v_base_price * v_multiplier;
                EXCEPTION
                    WHEN NO_DATA_FOUND THEN
                        v_day_price := v_base_price;
                END;
        END;
        v_current_date := v_current_date + 1;
        p_original_amount := p_original_amount + v_day_price;
    END LOOP;
    
    IF p_promotion_code IS NOT NULL THEN
        BEGIN
            SELECT id, discount_type, discount_value, min_booking_amount, max_discount_amount
            INTO v_promo_id, v_discount_type, v_discount_value, v_min_booking_amount, v_max_discount_amount
            FROM promotions
            WHERE code = p_promotion_code
              AND is_active = 1
              AND TRUNC(SYSDATE) BETWEEN start_date AND end_date;

            IF v_min_booking_amount IS NOT NULL AND p_original_amount < v_min_booking_amount THEN
                 p_message := 'Mã khuyến mãi yêu cầu đơn hàng tối thiểu ' || v_min_booking_amount;
            ELSE
                IF v_discount_type = 'PERCENTAGE' THEN
                    p_discount_amount := p_original_amount * (v_discount_value / 100);
                    IF v_max_discount_amount IS NOT NULL AND p_discount_amount > v_max_discount_amount THEN
                        p_discount_amount := v_max_discount_amount;
                    END IF;
                ELSIF v_discount_type = 'FIXED' THEN
                    p_discount_amount := v_discount_value;
                END IF;

                IF p_discount_amount > p_original_amount THEN
                    p_discount_amount := p_original_amount;
                END IF;

                p_total_amount := p_original_amount - p_discount_amount;
            END IF;

        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                p_message := 'Mã khuyến mãi không hợp lệ hoặc đã hết hạn';
        END;
    END IF;
    

EXCEPTION
    WHEN OTHERS THEN
        p_status := 'ERROR';
        p_message := 'Lỗi hệ thống: ' || SQLERRM;
END p_calculate_total_price;
