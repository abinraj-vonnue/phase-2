--index


-- index on equipment status : list all equipments filtered by status , avoids scanning entire table


CREATE INDEX idx_equipment_status ON equipment(status);


-- index on equipment id in bookings table 

CREATE INDEX idx_booking_e_id ON equipment(booking_id);
