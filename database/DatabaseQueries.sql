use hotelreservationdb;
show tables;

SELECT HotelId, R_type, MAX(Avg_rating) FROM
(SELECT Room.HotelId, R_type, AVG(Rating) as 'Avg_rating'
FROM Room INNER JOIN Review ON Room.HotelId=Review.HotelId AND Room.Room_no=Review.Room_no
WHERE STR_TO_DATE('08/16/17', '%m/%d/%Y')=
GROUP BY Room.HotelId, R_type) AS GROUPING
GROUP BY HotelId;

SELECT C_name, SUM(TotalAmt) 
FROM Customer INNER JOIN Reservation ON Customer.CID=Reservation.CID 
GROUP BY C_name 
ORDER BY TotalAmt DESC LIMIT 5;

SELECT bType, MAX(Avg_rating) 
FROM (SELECT Breakfast.bType, AVG(Rating) as Avg_rating FROM Breakfast INNER JOIN Review ON Breakfast.HotelId=Review.HotelId 
AND Breakfast.bType=Review.bType 
GROUP BY bType) AS GROUPING;

SELECT sType, MAX(Avg_rating) 
FROM (SELECT Service.sType, AVG(Rating) as Avg_rating FROM Service INNER JOIN Review ON Service.HotelId=Review.HotelId 
AND Service.sType=Review.sType GROUP BY sType) AS GROUPING;