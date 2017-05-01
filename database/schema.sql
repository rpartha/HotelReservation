use hotelreservationdb;

create table Hotel(
	HotelId char(10),
    A_street varchar(20),
    A_city varchar(20),
    A_country varchar(20),
    A_state varchar(20),
    A_zip varchar(8),
    primary key(HotelId));

create table PhoneNo(
	HotelId char(10),
    Phone_no varchar(12),
    primary key(HotelId,Phone_no),
    foreign key(HotelId) references Hotel(HotelId));

create table Room(
	HotelId char(10),
	Room_no integer,
    Price float,
    Capacity integer,
    Floor_no integer,
    R_description varchar(400),
    R_type varchar(20),
    primary key(HotelId,Room_no),
    foreign key(HotelId) references Hotel(HotelId));

create table Offer_Room(
	HotelId char(10),
    Room_no integer,
    SDate date,
    EDate date,
    Discount float,
    primary key(HotelId,Room_no),
    foreign key(HotelId,Room_no) references Room(HotelId,Room_no));

create table Reservation(
	CID char(21),
    Cnumber char(16),
    InvoiceNo char(10),
    ResDate date,
    TotalAmt float,
    primary key(InvoiceNo),
    foreign key(CID) references Customer(CID),
    foreign key(Cnumber) references CreditCard(Cnumber));

create table Reserves(
	HotelId char(10),
    Room_no integer,
    InvoiceNo char(10),
    InDate date,
    OutDate date,
    NoOfDays integer,
    primary key(HotelId,Room_no,InvoiceNo),
    foreign key(HotelId,Room_no) references Room(HotelId,Room_no),
    foreign key(InvoiceNo) references Reservation(InvoiceNo));

create table Customer(
	CID char(21),
    Email varchar(50),
    Addresss varchar(50),
    Phone_no varchar(15),
    C_name varchar(50),
    primary key(CID));

create table CreditCard(
	Cnumber char(16),
    BillingAddr varchar(200),
    CC_name varchar(50),
    SecCode char(3),
    CC_type varchar(20),
    ExpDate date,
    primary key(Cnumber));

create table Breakfast(
	HotelId char(10),
    bType varchar(50),
    Description varchar(400),
    bPrice float,
    primary key(HotelId,bType),
    foreign key(HotelId) references Hotel(HotelId));

create table Service(
	HotelId char(10),
    sType varchar(50),
    sCost float,
    primary key(HotelId,sType),
    foreign key(HotelId) references Hotel(HotelId));

create table includes(
	HotelId char(10),
    bType varchar(50),
    InvoiceNo char(10),
    primary key(HotelId,bType,InvoiceNo),
    foreign key(HotelId,bType) references Breakfast(HotelId,bType),
    foreign key(InvoiceNo) references Reservation(InvoiceNo));

create table provides(
	HotelId char(10),
    sType varchar(50),
    InvoiceNo char(10),
    primary key(HotelId,sType,InvoiceNo),
    foreign key(HotelId,sType) references Service(HotelId,sType),
    foreign key(InvoiceNo) references Reservation(InvoiceNo));

create table Review(
	CID char(21),
    ReviewId char(10),
    HotelId char(10),
    sType varchar(50) null,
    bType varchar(50) null,
    Room_no integer null,
    Rating integer,
    TextComment varchar(400),
    primary key(ReviewId),
    foreign key(CID) references Customer(CID),
    foreign key(HotelId,sType) references Service(HotelId,sType),
    foreign key(HotelId,bType) references Breakfast(HotelId,bType),
    foreign key(HotelId,Room_no) references Room(HotelId,Room_no));