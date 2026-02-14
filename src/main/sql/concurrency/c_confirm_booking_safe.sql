CREATE OR REPLACE PROCEDURE confirm_booking_safe (
    p_booking_id IN NUMBER,
    p_admin_id   IN NUMBER
) IS
    v_status bookings.status%TYPE;
BEGIN
    -- BƯỚC 1: Khóa dòng dữ liệu ngay khi đọc
    -- Nếu Admin B chạy lệnh này trong khi Admin A đang giữ khóa, B sẽ phải chờ.
    SELECT status 
    INTO v_status
    FROM bookings 
    WHERE booking_id = p_booking_id 
    FOR UPDATE; 

    -- BƯỚC 2: Kiểm tra lại trạng thái sau khi đã có khóa
    IF v_status = 'PENDING' THEN
        UPDATE bookings 
        SET status = 'CONFIRMED', 
            updated_by = p_admin_id,
            updated_at = SYSDATE
        WHERE booking_id = p_booking_id;
        
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Booking confirmed successfully.');
    ELSE
        -- Nếu trạng thái đã bị người khác thay đổi trước đó
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Booking was already processed by another admin.');
    END IF;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Booking not found.');
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
/
