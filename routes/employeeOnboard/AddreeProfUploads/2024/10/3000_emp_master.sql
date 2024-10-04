-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 06, 2024 at 02:49 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sathis_megaaopes`
--

-- --------------------------------------------------------

--
-- Table structure for table `emp_master`
--

CREATE TABLE `emp_master` (
  `emp_id` int(11) DEFAULT NULL,
  `f_name` varchar(7) DEFAULT NULL,
  `l_name` varchar(13) DEFAULT NULL,
  `DOJ` varchar(10) DEFAULT NULL,
  `designation` varchar(30) DEFAULT NULL,
  `department` varchar(24) DEFAULT NULL,
  `team` varchar(29) DEFAULT NULL,
  `reporting_team_lead` varchar(18) DEFAULT NULL,
  `reporting_manager` varchar(18) DEFAULT NULL,
  `personal_email_id` varchar(30) DEFAULT NULL,
  `employment_confirmation` varchar(3) DEFAULT NULL,
  `confirmation_cate` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `emp_master`
--

INSERT INTO `emp_master` (`emp_id`, `f_name`, `l_name`, `DOJ`, `designation`, `department`, `team`, `reporting_team_lead`, `reporting_manager`, `personal_email_id`, `employment_confirmation`, `confirmation_cate`) VALUES
(18001, 'Kannan', 'R', '10/12/2012', 'CEO', '1', '1', '', '', 'kannan.r@megaaopes.com', 'Yes', '10/12/2012'),
(18002, 'Shamala', 'Nagaveni S', '14/03/2014', 'Vice President - HR Operations', '1', '1', '18001', '18001', 'shamala.srinivas@megaaopes.com', 'Yes', '14/03/2014'),
(20019, 'Adarsh', 'B M', '20/06/2024', 'Team Leader', '2', '2', '18937', '18002', 'adarsh.adarsh84@yahoo.com', 'NO', ''),
(18734, 'Seema', '', '18/08/2020', 'HR - Telecaller', '3', '3', '18002', '18002', 'seemaseema09712@gmail.com', 'Yes', '21/03/2021'),
(19875, 'Sapna', 'Mani', '22-01-2024', 'HR Executive', '3', '4', '18002', '18002', 'sapnamariya@gmail.com', 'NO', ''),
(19877, 'Dilip', 'S', '01-02-2024', 'HR Executive', '3', '4', '18002', '18002', 'daalidilip@gmail.com', 'NO', ''),
(19932, 'Puja', 'Chetry', '12/03/2024', 'Front Desk Executive', '3', '5', '18002', '18002', 'pchetry531@gmail.com', 'NO', ''),
(19631, 'Konga', 'Aditya Vardan', '29-05-2023', 'System Admin', '4', '6', '18002', '18002', 'adityareddyvardan@gmail.com', 'NO', ''),
(19737, 'Praveen', 'P', '04-08-2023', 'Admin Executive', '5', '7', '18002', '18002', 'Praveen2082914@gmail.com', 'NO', ''),
(19985, 'Sampath', 'B S', '24/05/2024', 'Admin Executive', '5', '7', '18002', '18002', 'sampu5031@gmail.com', 'NO', ''),
(19375, 'Ruben', 'Sadmal S', '29/08/2022', 'Quality Analyst', '6', '8', '19376', '18937', 'rubenrobbie@gmail.com', 'Yes', '21/05/2023'),
(20011, 'Rohit', 'V', '17/06/2024', 'Business Development Executive', '7', '9', '18002', '18002', 'Rohit22vijay@gmail.com', 'NO', ''),
(20027, 'Sathis', 'Kumar R', '10/07/2024', 'Software Developer', '8', '10', '18002', '18002', 'sksathis2002@gmail.com', 'NO', ''),
(18937, 'Manoj', 'Kumar G', '28/06/2021', 'Assistant Manager', '2', '2', '18002', '18002', 'manoj@megaaopes.com', 'Yes', '10/12/2023'),
(19376, 'Sathish', 'Kumar D', '29/08/2022', 'Team Leader', '2', '2', '18937', '18002', 'sathish@megaaopes.com', 'Yes', '10/12/2023'),
(19673, 'Rohit', 'Singh', '21-06-2023', 'Assistant Manager', '2', '2', '18002', '18002', 'rsyuvraj1@gmail.com', 'NO', ''),
(19779, 'Jyothi', 'S', '19/09/2023', 'Team Leader', '2', '2', '19673', '18002', 'jyothisampath4300@gmail.com', 'NO', ''),
(20055, 'Murthy', 'Gajendrean', '01/08/2024', 'Team Leader', '2', '2', '18937', '18002', 'g11.murthy@gmail.com', 'NO', '');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
