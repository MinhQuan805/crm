CREATE OR REPLACE PROCEDURE update_booking_and_room_safe (
    p_booking_id IN NUMBER,
    p_room_id    IN NUMBER
) IS
    v_dummy NUMBER;
BEGIN
    -- CHIẾN LƯỢC: Luôn khóa theo thứ tự cố định để tránh Deadlock.
    -- Quy định: Luôn khóa ROOM trước, sau đó mới khóa BOOKING.
    
    -- BƯỚC 1: Khóa Room (Resource 1)
    SELECT 1 INTO v_dummy 
    FROM rooms 
    WHERE room_id = p_room_id 
    FOR UPDATE;

    -- BƯỚC 2: Khóa Booking (Resource 2)
    SELECT 1 INTO v_dummy 
    FROM bookings 
    WHERE booking_id = p_booking_id 
    FOR UPDATE;

    -- BƯỚC 3: Thực hiện Update (Thứ tự update ở đây không quan trọng bằng thứ tự khóa ở trên)
    UPDATE rooms 
    SET last_maintenance = SYSDATE 
    WHERE room_id = p_room_id;

    UPDATE bookings 
    SET notes = 'Room maintenance scheduled' 
    WHERE booking_id = p_booking_id;

    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Updated successfully without deadlock.');

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        -- Nếu vẫn xảy ra deadlock (do quy trình khác không tuân thủ), Oracle sẽ báo ORA-00060
        IF SQLCODE = -60 THEN
             DBMS_OUTPUT.PUT_LINE('Deadlock detected. Please retry.');
        ELSE
             RAISE;
        END IF;
END;
/
