-- =========================
-- 1. Đảm bảo bảng hỗ trợ tiếng Việt
-- =========================
ALTER TABLE products
    CONVERT TO CHARACTER SET utf8mb4
        COLLATE utf8mb4_unicode_ci;

-- =========================
-- 2. Insert fake data phim
-- =========================
INSERT INTO products (name, description, price, stock) VALUES
                                                           ('Avengers: Endgame', 'Biệt đội Avengers tập hợp để đảo ngược cú búng tay của Thanos.', 90000.00, 80),
                                                           ('Spider-Man: No Way Home', 'Peter Parker đối mặt với đa vũ trụ và những phản diện từ các thế giới khác.', 85000.00, 80),
                                                           ('Doctor Strange in the Multiverse of Madness', 'Doctor Strange bước vào cuộc hành trình nguy hiểm xuyên qua đa vũ trụ hỗn loạn.', 95000.00, 80),
                                                           ('Fast & Furious 10', 'Dom và gia đình đối đầu với kẻ thù mới đầy thù hận và nguy hiểm.', 88000.00, 80),
                                                           ('John Wick 4', 'John Wick tiếp tục cuộc chiến sinh tồn chống lại thế lực ngầm toàn cầu.', 92000.00, 80),
                                                           ('The Batman', 'Batman điều tra chuỗi án mạng bí ẩn làm rung chuyển thành phố Gotham.', 87000.00, 80),
                                                           ('Aquaman and the Lost Kingdom', 'Aquaman quay trở lại với hành trình bảo vệ vương quốc dưới đáy đại dương.', 86000.00, 80),
                                                           ('Mission: Impossible - Dead Reckoning', 'Ethan Hunt nhận nhiệm vụ mới đầy rủi ro và thử thách.', 98000.00, 80),
                                                           ('Transformers: Rise of the Beasts', 'Các Transformer trở lại trong trận chiến mới để bảo vệ Trái Đất.', 91000.00, 80),
                                                           ('Kung Fu Panda 4', 'Po tiếp tục hành trình trở thành biểu tượng kung fu huyền thoại.', 75000.00, 80),
                                                           ('Detective Conan: The Movie 27', 'Conan điều tra một vụ án mới với nhiều bí ẩn và bất ngờ.', 70000.00, 80),
                                                           ('Dune: Part Two', 'Paul Atreides tiếp tục hành trình định mệnh trên hành tinh cát Arrakis.', 99000.00, 80),
                                                           ('Avatar: The Way of Water', 'Jake Sully và gia đình chiến đấu để bảo vệ Pandora trước hiểm họa mới.', 100000.00, 80),
                                                           ('Deadpool 3', 'Deadpool trở lại với phong cách hài hước, hỗn loạn và đầy hành động.', 93000.00, 80),
                                                           ('Joker: Folie à Deux', 'Câu chuyện tiếp theo của Joker mở ra với màu sắc đen tối và điên loạn.', 89000.00, 80);