-- Tạo bảng Trạm xăng
CREATE TABLE GasStations (
    StationID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Address VARCHAR(200),
    City VARCHAR(100),
    State VARCHAR(100),
    ZipCode VARCHAR(20),
    ContactNumber VARCHAR(20),
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Hàng hoá
CREATE TABLE Goods (
    GoodsID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description VARCHAR(255),
    Unit VARCHAR(20),
    CurrentPrice DECIMAL(10,2),
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Trụ bơm
CREATE TABLE Pumps (
    PumpID SERIAL PRIMARY KEY,
    StationID INT NOT NULL,
    GoodsID INT NOT NULL,
    PumpNumber VARCHAR(20),
    Status VARCHAR(50),
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (StationID) REFERENCES GasStations(StationID),
    FOREIGN KEY (GoodsID) REFERENCES Goods(GoodsID)
);

-- Tạo bảng Giao dịch
CREATE TABLE Transactions (
    TransactionID SERIAL PRIMARY KEY,
    DateTime TIMESTAMP NOT NULL,
    PumpID INT NOT NULL,
    Quantity DECIMAL(10,2) NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    TotalValue DECIMAL(10,2) NOT NULL,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PumpID) REFERENCES Pumps(PumpID)
);

-- Tạo các chỉ mục để cải thiện hiệu suất
CREATE INDEX idx_pumps_stationid ON Pumps(StationID);
CREATE INDEX idx_pumps_goodsid ON Pumps(GoodsID);
CREATE INDEX idx_transactions_pumpid ON Transactions(PumpID);

-- Tạo hàm cập nhật updatedAt tự động
CREATE OR REPLACE FUNCTION update_updatedAt_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updatedAt = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Tạo trigger cho bảng GasStations
CREATE TRIGGER trigger_update_updatedAt_gasstations
BEFORE UPDATE ON GasStations
FOR EACH ROW EXECUTE PROCEDURE update_updatedAt_column();

-- Tạo trigger cho bảng Goods
CREATE TRIGGER trigger_update_updatedAt_goods
BEFORE UPDATE ON Goods
FOR EACH ROW EXECUTE PROCEDURE update_updatedAt_column();

-- Tạo trigger cho bảng Pumps
CREATE TRIGGER trigger_update_updatedAt_pumps
BEFORE UPDATE ON Pumps
FOR EACH ROW EXECUTE PROCEDURE update_updatedAt_column();

-- Tạo trigger cho bảng Transactions
CREATE TRIGGER trigger_update_updatedAt_transactions
BEFORE UPDATE ON Transactions
FOR EACH ROW EXECUTE PROCEDURE update_updatedAt_column();
