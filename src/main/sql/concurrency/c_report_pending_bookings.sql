CREATE OR REPLACE PROCEDURE report_pending_bookings IS
    v_count_1 NUMBER;
    v_count_2 NUMBER;
BEGIN
    -- BƯỚC 1: Thiết lập mức độ cô lập cao nhất
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

    -- Lần đếm 1
    SELECT COUNT(*) INTO v_count_1 FROM bookings WHERE status = 'PENDING';
    
    -- Giả lập thời gian xử lý (Admin B insert dữ liệu trong lúc này)
    DBMS_LOCK.SLEEP(5); 

    -- Lần đếm 2
    -- Với SERIALIZABLE, dù B có commit insert, A vẫn thấy kết quả cũ (v_count_2 = v_count_1)
    SELECT COUNT(*) INTO v_count_2 FROM bookings WHERE status = 'PENDING';

    DBMS_OUTPUT.PUT_LINE('Count 1: ' || v_count_1);
    DBMS_OUTPUT.PUT_LINE('Count 2: ' || v_count_2);

    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        -- ORA-08177: can't serialize access for this transaction
        IF SQLCODE = -8177 THEN
            DBMS_OUTPUT.PUT_LINE('Dữ liệu thay đổi quá nhiều, vui lòng thử lại.');
        ELSE
            RAISE;
        END IF;
END;
/
