CREATE OR REPLACE PROCEDURE p_cancel_booking (
    p_booking_id IN bookings.id%TYPE,
    p_reason IN VARCHAR2,
    p_updated_by IN VARCHAR2 DEFAULT 'admin',
    p_status OUT VARCHAR2,
    p_message OUT VARCHAR2
) IS 
    v_current_status bookings.status%TYPE;
    v_room_id bookings.room_id%TYPE;
BEGIN
    SAVEPOINT start_cancel;

    BEGIN
        SELECT status, room_id
        INTO v_current_status, v_room_id
        FROM bookings
        WHERE id = booking_id
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

    IF v_current_status NOT IN ('PENDING', 'CONFIRMED') THEN
        p_status := 'ERROR';
        p_message := 'Không thể hủy booking ở trạng thái ' || v_current_status;
        RETURN;
    END IF;

    UPDATE bookings SET status = 'CANCELLED' WHERE id = p_booking_id;

    UPDATE rooms SET status = 'AVAILABLE', updated_at = SYSTIMESTAMP WHERE id = v_room_id;

    INSERT INTO booking_history (id, booking_id, action, performed_by, timestamp, notes)
    VALUES (BOOKING_HISTORY_SEQ, p_booking_id, 'CANCEL', p_updated_by, SYSTIMESTAMP, p_reason);

    COMMIT;
    p_status := 'SUCCESS';
    p_message := 'Hủy booking thành công';

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK TO start_cancel;
        p_status := 'ERROR';
        p_message := 'Lỗi hệ thống: ' || SQLERRM;
END p_cancel_booking;
