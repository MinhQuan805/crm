-- Procedure to insert a new booking into the bookings table
CREATE OR REPLACE PROCEDURE p_insert_booking (
    p_customer_id IN bookings.customer_id%TYPE,
    p_room_id IN bookings.room_id%TYPE,
    p_check_in_date IN bookings.check_in_date%TYPE,
    p_check_out_date IN bookings.check_out_date%TYPE,
    p_total_price IN bookings.total_price%TYPE,
    p_status IN bookings.status%TYPE,
    p_special_requests IN bookings.special_requests%TYPE,
    p_admin_username IN VARCHAR2 DEFAULT 'admin',
    p_booking_id OUT bookings.id%TYPE
) IS 
    v_room_status   VARCHAR2(20);
    v_room_number   VARCHAR2(20);
    v_days_count    NUMBER;
    v_dummy NUMBER;
    v_created_at    TIMESTAMP := SYSTIMESTAMP;

    e_room_locked EXCEPTION;
BEGIN
    SAVEPOINT start;

    BEGIN
        SELECT * INTO v_customer_exists 
        FROM customers 
        WHERE id = p_customer_id;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            p_status := 'ERROR';
            p_message := 'Customer ID không tồn tại';
            RETURN;
        WHEN e_room
    END;

    BEGIN
        SELECT * INTO v_room_exists, v_room_status, v_room_number
        FROM rooms
        WHERE id = p_room_id;
        FOR UPDATE NOWAIT;
        IF v_room_status != 'AVAILABLE' THEN
            ROLLBACK TO start;
            p_status := 'ERROR';
            p_message := 'Phòng hiện không khả dụng';
            RETURN;
        END IF;

    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            p_status := 'ERROR';
            p_message := 'Room ID không tồn tại';
            RETURN;
        WHEN e_room_locked THEN
            p_status := 'ERROR';
            p_message := 'Phòng này đang được giao dịch bởi người khác. Vui lòng thử lại sau.';
            RETURN;
    END;

    IF p_check_out_date <= p_check_in_date THEN
        p_status := 'ERROR';
        p_message := 'Invalid dates. Check-out must be after check-in';
        RAISE e_invalid_dates;
    END IF;

    v_days_count := p_check_out_date - p_check_in_date;

    SELECT BOOKING_SEQ.NEXTVAL INTO p_booking_id FROM DUAL;

    INSERT INTO bookings (
        id, customer_id, room_id, check_in_date, check_out_date, 
        total_price, status, special_requests, created_at
    ) VALUES (
        p_booking_id, p_customer_id, p_room_id, p_check_in_date, p_check_out_date,
        p_total_price, 'CONFIRMED', p_special_requests, v_created_at
    );

    IF TRUNC(p_check_in_date) = TRUNC(SYSDATE) THEN
        UPDATE rooms SET status = 'OCCUPIED', updated_at = SYSTIMESTAMP WHERE id = p_room_id;
    ELSE
        UPDATE rooms SET status = 'RESERVED', updated_at = SYSTIMESTAMP WHERE id = p_room_id;
    END IF;

    INSERT INTO booking_history (
        id, booking_id, action, performed_by, notes, timestamp
    ) VALUES (
        BOOKING_HISTORY_SEQ.NEXTVAL, p_booking_id, 'CREATED', p_admin_username,
        'Đặt phòng ' || v_room_number, SYSTIMESTAMP
    );

    COMMIT;

    p_status := 'SUCCESS';
    p_message := 'Đặt phòng thành công cho phòng ' || v_room_number;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        p_status := 'ERROR';
        p_message := 'Lỗi hệ thống';
END p_insert_booking;