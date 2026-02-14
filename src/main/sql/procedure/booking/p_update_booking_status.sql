CREATE OR REPLACE PROCEDURE p_update_booking_status (
    p_booking_id IN bookings.id%TYPE,
    p_new_status IN bookings.status%TYPE,
    p_note IN VARCHAR2 DEFAULT NULL,
    p_updated_by IN VARCHAR2 DEFAULT 'admin',
    p_status OUT VARCHAR2,
    p_message OUT VARCHAR2
) IS 
    v_current_status bookings.status%TYPE;
    v_room_id bookings.room_id%TYPE;
    e_invalid_transition EXCEPTION;
BEGIN
    SAVEPOINT start;

    BEGIN
        SELECT status, room_id INTO v_current_status, v_room_id
        FROM bookings
        WHERE id = p_booking_id
        FOR UPDATE NOWAIT;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            p_status := 'ERROR';
            p_message := 'Booking ID không tồn tại';
            RETURN;
        WHEN OTHERS THEN
            p_status := 'ERROR';
            p_message := 'Booking đang được xử lý bởi người khác';
            RETURN;
    END;

    IF v_current_status = p_new_status THEN
        p_status := 'SUCCESS';
        p_message := 'Trạng thái đã là ' || p_new_status;
        RETURN;
    END IF;

    -- Validate: PENDING -> CONFIRMED -> CHECKED_IN -> CHECKED_OUT -> CANCELLED (terminal)
    IF (v_current_status = 'PENDING' AND p_new_status IN ('CONFIRMED', 'CANCELLED')) OR
       (v_current_status = 'CONFIRMED' AND p_new_status IN ('CHECKED_IN', 'CANCELLED')) OR
       (v_current_status = 'CHECKED_IN' AND p_new_status = 'CHECKED_OUT') THEN
        NULL; -- Valid
    ELSE
        RAISE e_invalid_transition;
    END IF;

    UPDATE bookings SET status = p_new_status WHERE id = p_booking_id;

    -- Update Room Status
    IF p_new_status = 'CONFIRMED' THEN
        UPDATE rooms SET status = 'RESERVED', updated_at = SYSTIMESTAMP WHERE id = v_room_id;
    ELSIF p_new_status = 'CHECKED_IN' THEN
        UPDATE rooms SET status = 'OCCUPIED', updated_at = SYSTIMESTAMP WHERE id = v_room_id;
    ELSIF p_new_status IN ('CHECKED_OUT', 'CANCELLED') THEN
        UPDATE rooms SET status = 'AVAILABLE', updated_at = SYSTIMESTAMP WHERE id = v_room_id;
    END IF;

    INSERT INTO booking_history (id, booking_id, action, performed_by, notes, timestamp)
    VALUES (BOOKING_HISTORY_SEQ.NEXTVAL, p_booking_id, 'UPDATE_STATUS', p_updated_by, 
            'Status changed: ' || v_current_status || ' -> ' || p_new_status || '. ' || p_note, SYSTIMESTAMP);

    COMMIT;
    p_status := 'SUCCESS';
    p_message := 'Cập nhật trạng thái thành công';

EXCEPTION
    WHEN e_invalid_transition THEN
        ROLLBACK TO start;
        p_status := 'ERROR';
        p_message := 'Chuyển đổi trạng thái không hợp lệ: ' || v_current_status || ' -> ' || p_new_status;
    WHEN OTHERS THEN
        ROLLBACK TO start;
        p_status := 'ERROR';
        p_message := 'Lỗi hệ thống: ' || SQLERRM;
END p_update_booking_status;