-- Insert Administrator (Password: admin123 hashlenmiş formada olmalıdır, bu bir nümunədir)
INSERT INTO users (id, first_name, last_name, email, password, is_admin)
VALUES ('36c27e1d-3382-491b-9442-70b9eb020822', 'Admin', 'HBnB', 'admin@hbnb.com', 'hashed_password_here', TRUE);

-- Insert Initial Amenities
INSERT INTO amenities (id, name) VALUES (uuid(), 'WiFi');
INSERT INTO amenities (id, name) VALUES (uuid(), 'Swimming Pool');
INSERT INTO amenities (id, name) VALUES (uuid(), 'Air Conditioning');
