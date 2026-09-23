-- Initial Seed Data for Blood Bank System (Chennai Region Focused)

-- Default Users (Password is bcrypt or plain text for initial dev: admin123 / user123)
INSERT INTO users (username, email, password, full_name, phone, role)
VALUES 
('admin', 'admin@bloodbank.org', 'admin123', 'Chief Medical Officer Dr. A. Raman', '9876543210', 'ADMIN'),
('salman', 'salman@example.com', 'user123', 'Mohammed Salman', '9876543211', 'USER')
ON DUPLICATE KEY UPDATE id=id;

-- Initial Blood Inventory
INSERT INTO blood_inventory (blood_group, units_available, reserved_units, critical_threshold)
VALUES 
('A+', 18, 2, 5),
('A-', 6, 1, 4),
('B+', 24, 4, 6),
('B-', 4, 2, 4),
('O+', 32, 5, 8),
('O-', 5, 3, 5),
('AB+', 12, 1, 3),
('AB-', 3, 1, 3)
ON DUPLICATE KEY UPDATE units_available=VALUES(units_available);

-- Initial Donors (All in Chennai Neighborhoods: Porur, Adyar, Anna Nagar, etc.)
INSERT INTO donors (full_name, blood_group, gender, age, phone, email, city, district, address, last_donated_date, is_available, total_donations, verified)
VALUES
('Mohammed Salman', 'O+', 'Male', 26, '9876543210', 'salman@example.com', 'Chennai', 'Anna Nagar', 'Anna Nagar, 2nd Avenue, Near Roundtana', '2025-11-15', true, 6, true),
('Dr. Arun Kumar', 'A+', 'Male', 34, '9944332211', 'arun.k@hospital.org', 'Chennai', 'Kilpauk', 'Kilpauk Medical Quarters, PH Road', '2025-10-05', true, 12, true),
('Priya Sundaram', 'B+', 'Female', 28, '9000099999', 'priya.s@techcorp.in', 'Chennai', 'Velachery', 'Velachery Main Road, Near Phoenix Marketcity', '2026-01-20', true, 3, true),
('Vijay Raghavan', 'O-', 'Male', 31, '9888877777', 'vijay.r@mail.com', 'Chennai', 'Porur', 'Near Sri Ramachandra Hospital, Mount-Poonamallee Rd, Porur', '2025-08-10', true, 8, true),
('Ananya Deshmukh', 'AB+', 'Female', 24, '9777766666', 'ananya.d@univ.edu', 'Chennai', 'Adyar', 'Gandhi Nagar 2nd Main Road, Adyar', '2026-02-01', true, 2, true),
('Karthik Natarajan', 'B-', 'Male', 29, '9666655555', 'karthik.n@design.com', 'Chennai', 'T. Nagar', 'Pondy Bazaar, Near Panagal Park, T. Nagar', '2025-09-12', true, 4, true),
('Dr. Rajesh Varma', 'AB-', 'Male', 42, '9555544444', 'varma.md@health.gov', 'Chennai', 'Guindy', 'Race Course Road, Near Kathipara, Guindy', '2025-06-25', true, 15, true),
('Meera Chandran', 'O+', 'Female', 27, '9444433333', 'meera.c@social.org', 'Chennai', 'Besant Nagar', 'Besant Nagar 4th Main Road, Near Elliot Beach', '2025-12-01', true, 5, true)
ON DUPLICATE KEY UPDATE id=id;

-- Initial Blood Requests (All in Chennai Hospitals & Neighborhoods)
INSERT INTO blood_requests (tracking_code, patient_name, blood_group, units_required, hospital_name, city, district, contact_person, contact_phone, urgency, status, required_date, medical_reason, admin_remarks)
VALUES
('REQ-2026-1001', 'Kavitha R.', 'O-', 2, 'Apollo Hospitals Greams Road', 'Chennai', 'Thousand Lights', 'R. Rangarajan', '9876540001', 'CRITICAL', 'PENDING', '2026-03-24', 'Emergency bypass cardiovascular surgery with active intraoperative hemorrhage.', 'Prioritized for immediate O- unit cross-matching.'),
('REQ-2026-1002', 'Suresh Babu', 'A+', 3, 'Sri Ramachandra Hospital Porur', 'Chennai', 'Porur', 'V. Lakshmi', '9876540002', 'URGENT', 'APPROVED', '2026-03-25', 'Acute trauma resuscitation following vehicular collision in Porur junction.', 'Approved by Dr. Raman; blood components reserved in cooling pack.'),
('REQ-2026-1003', 'Master Aarav (Age 8)', 'B+', 1, 'Child Trust Hospital Nungambakkam', 'Chennai', 'Nungambakkam', 'Deepa S.', '9876540003', 'NORMAL', 'COMPLETED', '2026-03-20', 'Scheduled pediatric thalassemia transfusion protocol.', 'Dispensed on March 20, 2026.'),
('REQ-2026-1004', 'Sangeetha M.', 'AB-', 1, 'Fortis Malar Hospital Adyar', 'Chennai', 'Adyar', 'M. Murugan', '9876540004', 'URGENT', 'PENDING', '2026-03-26', 'High-risk Caesarean delivery with anticipated placenta accreta.', 'Pending obstetrician confirmation.')
ON DUPLICATE KEY UPDATE id=id;
